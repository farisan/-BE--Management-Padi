const prisma = require('../config/prisma');

const createPanen = async (data) => {
  const { penanamanId, tanggalPanen, jumlahPanen, kualitas } = data;

  if (!penanamanId || !tanggalPanen || !jumlahPanen || !kualitas) {
    throw new Error('Semua field harus diisi');
  }

  // Update status penanaman menjadi panen
  await prisma.penanamanPadi.update({
    where: { id: penanamanId },
    data: { status: 'panen' }
  });

  return await prisma.panenPadi.create({
    data: {
      penanamanId,
      tanggalPanen: new Date(tanggalPanen),
      jumlahPanen: parseFloat(jumlahPanen),
      kualitas,
    },
    include: {
      penanaman: {
        include: { petani: { select: { name: true } } }
      }
    }
  });
};

const getAllPanen = async (userRole, userId) => {
  const queryWhere = {};

  if (userRole === 'petani') {
    queryWhere.penanaman = {
      petaniId: userId
    };
  }

  return await prisma.panenPadi.findMany({
    where: queryWhere,
    include: {
      penanaman: {
        include: { petani: { select: { name: true, id: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createPanen,
  getAllPanen,
};
