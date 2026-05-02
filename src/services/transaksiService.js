const prisma = require('../config/prisma');

const getAllTransaksi = async (userRole, userId) => {
  const queryWhere = {};

  if (userRole === 'petani') {
    queryWhere.pengajuan = {
      petaniId: userId
    };
  } else if (userRole === 'tengkulak') {
    queryWhere.pengajuan = {
      tengkulakId: userId
    };
  }

  return await prisma.transaksiPenjualan.findMany({
    where: queryWhere,
    include: {
      pengajuan: {
        include: {
          panen: { include: { penanaman: true } },
          petani: { select: { name: true, address: true } },
          tengkulak: { select: { name: true } },
        }
      }
    },
    orderBy: { tanggalTransaksi: 'desc' },
  });
};

module.exports = {
  getAllTransaksi,
};
