const prisma = require('../config/prisma');

const createPenanaman = async (data, petaniId) => {
  const { tanggalTebar, estimasiPanen, luasLahan, jenisPadi, status } = data;

  if (!tanggalTebar || !estimasiPanen || !luasLahan || !jenisPadi || !status) {
    throw new Error('Semua field harus diisi');
  }

  return await prisma.penanamanPadi.create({
    data: {
      petaniId,
      tanggalTebar: new Date(tanggalTebar),
      estimasiPanen: new Date(estimasiPanen),
      luasLahan: parseFloat(luasLahan),
      jenisPadi,
      status, // 'proses' atau 'panen'
    },
  });
};

const getAllPenanaman = async (userRole, userId, query) => {
  const { jenisPadi, status } = query;
  const queryWhere = {};

  if (jenisPadi) {
    queryWhere.jenisPadi = { contains: jenisPadi, mode: 'insensitive' };
  }

  if (status) {
    queryWhere.status = status;
  }

  if (userRole === 'petani') {
    queryWhere.petaniId = userId;
  }

  return await prisma.penanamanPadi.findMany({
    where: queryWhere,
    include: { petani: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getPenanamanById = async (id, userRole, userId) => {
  const penanaman = await prisma.penanamanPadi.findUnique({
    where: { id },
    include: { petani: { select: { name: true } } },
  });

  if (!penanaman) {
    throw new Error('Data penanaman tidak ditemukan');
  }

  if (userRole === 'petani' && penanaman.petaniId !== userId) {
    throw new Error('Akses ditolak, ini bukan data Anda');
  }

  return penanaman;
};

const updatePenanaman = async (id, data, userRole, userId) => {
  const existingPenanaman = await prisma.penanamanPadi.findUnique({
    where: { id },
  });

  if (!existingPenanaman) {
    throw new Error('Data penanaman tidak ditemukan');
  }

  if (userRole === 'petani' && existingPenanaman.petaniId !== userId) {
    throw new Error('Akses ditolak, ini bukan data Anda');
  }

  const { tanggalTebar, estimasiPanen, luasLahan, jenisPadi, status } = data;

  return await prisma.penanamanPadi.update({
    where: { id },
    data: {
      tanggalTebar: tanggalTebar ? new Date(tanggalTebar) : undefined,
      estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : undefined,
      luasLahan: luasLahan ? parseFloat(luasLahan) : undefined,
      jenisPadi: jenisPadi || undefined,
      status: status || undefined,
    },
  });
};

const deletePenanaman = async (id, userRole, userId) => {
  const existingPenanaman = await prisma.penanamanPadi.findUnique({
    where: { id },
  });

  if (!existingPenanaman) {
    throw new Error('Data penanaman tidak ditemukan');
  }

  if (userRole === 'petani' && existingPenanaman.petaniId !== userId) {
    throw new Error('Akses ditolak, ini bukan data Anda');
  }

  return await prisma.penanamanPadi.delete({
    where: { id },
  });
};

module.exports = {
  createPenanaman,
  getAllPenanaman,
  getPenanamanById,
  updatePenanaman,
  deletePenanaman,
};
