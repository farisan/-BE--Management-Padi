const prisma = require('../config/prisma');

const createPengajuan = async (data, petaniId) => {
  const { panenId, tengkulakId, hargaTawaran } = data;

  if (!panenId || !tengkulakId || !hargaTawaran) {
    throw new Error('Semua field harus diisi');
  }

  const panen = await prisma.panenPadi.findUnique({ where: { id: panenId } });
  if (!panen) throw new Error('Data panen tidak ditemukan');

  return await prisma.$transaction(async (tx) => {
    const pengajuan = await tx.pengajuanPenjualan.create({
      data: {
        panenId,
        petaniId,
        tengkulakId,
        hargaTawaran: parseFloat(hargaTawaran),
        status: 'pending',
      },
    });

    // Update status penanaman menjadi diajukan
    await tx.penanamanPadi.update({
      where: { id: panen.penanamanId },
      data: { status: 'diajukan' }
    });

    return pengajuan;
  });
};

const getAllPengajuan = async (userRole, userId) => {
  const queryWhere = {};

  if (userRole === 'petani') {
    queryWhere.petaniId = userId;
  } else if (userRole === 'tengkulak') {
    queryWhere.tengkulakId = userId;
  }

  return await prisma.pengajuanPenjualan.findMany({
    where: queryWhere,
    include: {
      panen: {
        include: { penanaman: true }
      },
      petani: { select: { name: true, address: true } },
      tengkulak: { select: { name: true } },
      persetujuan: true,
      transaksiPenjualan: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateStatusDilihat = async (id, tengkulakId) => {
  const pengajuan = await prisma.pengajuanPenjualan.findUnique({ 
    where: { id },
    include: { panen: true }
  });

  if (!pengajuan) throw new Error('Pengajuan tidak ditemukan');
  if (pengajuan.tengkulakId !== tengkulakId) throw new Error('Akses ditolak');
  if (pengajuan.status !== 'pending') throw new Error('Hanya pengajuan pending yang bisa diubah menjadi dilihat');

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.pengajuanPenjualan.update({
      where: { id },
      data: { status: 'dilihat' }
    });

    // Update status penanaman menjadi proses cek
    await tx.penanamanPadi.update({
      where: { id: pengajuan.panen.penanamanId },
      data: { status: 'proses cek' }
    });

    return updated;
  });
};

const responPengajuan = async (id, tengkulakId, responData) => {
  const { status, catatan, hargaDeal } = responData; // status: 'approve' | 'reject'

  if (!['approve', 'reject'].includes(status)) {
    throw new Error('Status respon tidak valid');
  }

  const pengajuan = await prisma.pengajuanPenjualan.findUnique({ 
    where: { id },
    include: { panen: true }
  });

  if (!pengajuan) throw new Error('Pengajuan tidak ditemukan');
  if (pengajuan.tengkulakId !== tengkulakId) throw new Error('Akses ditolak');
  if (pengajuan.status === 'disetujui' || pengajuan.status === 'ditolak') {
    throw new Error('Pengajuan ini sudah direspon sebelumnya');
  }

  // Gunakan transaction agar konsisten
  return await prisma.$transaction(async (tx) => {
    // 1. Buat record persetujuan
    await tx.persetujuan.create({
      data: {
        pengajuanId: id,
        tengkulakId,
        status,
        catatan,
        approvedAt: status === 'approve' ? new Date() : null,
      }
    });

    const pengajuanStatus = status === 'approve' ? 'disetujui' : 'ditolak';

    // 2. Update status pengajuan
    const updatedPengajuan = await tx.pengajuanPenjualan.update({
      where: { id },
      data: { status: pengajuanStatus }
    });

    // 2b. Update status penanaman padi mengikuti hasil
    await tx.penanamanPadi.update({
      where: { id: pengajuan.panen.penanamanId },
      data: { status: pengajuanStatus }
    });

    // 3. Jika approve, buat transaksi penjualan
    if (status === 'approve') {
      const dealPrice = hargaDeal ? parseFloat(hargaDeal) : pengajuan.hargaTawaran;
      const totalBerat = pengajuan.panen.jumlahPanen;
      const totalHarga = dealPrice * totalBerat;

      await tx.transaksiPenjualan.create({
        data: {
          pengajuanId: id,
          hargaDeal: dealPrice,
          totalBerat,
          totalHarga,
        }
      });
    }

    return updatedPengajuan;
  });
};

module.exports = {
  createPengajuan,
  getAllPengajuan,
  updateStatusDilihat,
  responPengajuan,
};
