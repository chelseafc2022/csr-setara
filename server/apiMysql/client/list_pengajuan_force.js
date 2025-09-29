const express = require('express');
var db = require('../../db/MySql/umum');


const fs = require('fs');
const path = require("path");

var multer=require("multer");
var upload = require('../../db/multer/image');

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();


router.get('/kecamatan', (req, res) => {

    var query = `
    SELECT master_kecamatan.nama_kecamatan,
    master_kecamatan.kecamatan_id
        
        FROM master_kecamatan

        WHERE master_kecamatan.kabupaten_id = 7405 
   
    `;
     db.query(query, (err, row)=>{
        if(err) {
            res.send(err);
            console.log(err)
        }else{
            res.send(row);
        }
    })
});

router.post('/kecamatan', (req, res) => {

    var userx = req.user.profile

    
    var filter_akses = ''

    if (userx.menu_klp == 1) {
        filter_akses = ``
    } else {
        filter_akses = ` AND master_kecamatan.kecamatan_id = '`+userx.kecamatan_id+`'` ;
    }

    let view = ` 
        SELECT * FROM master_kecamatan
        WHERE master_kecamatan.kabupaten_id = 7405
        `+filter_akses+`
        ORDER BY nama_kecamatan
    `;

    db.query(view, (err, row)=>{
        if (err) {
            res.json(err)
        }else{
            res.json(row)
        }
    })
});

router.post('/desa', (req, res) => {

    var query = `
    SELECT master_des_kel.nama_des_kel,
    master_des_kel.des_kel_id
        
        FROM master_des_kel

        WHERE master_des_kel.kecamatan_id = '`+req.body.kecamatan_id+`' 
   
    `;
     db.query(query, (err, row)=>{
        if(err) {
            res.send(err);
            console.log(err)
        }else{
            res.send(row);
        }
    })
});

  // API untuk ambil informasi mitra (users + perusahaan)
router.get('/mitra/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT 
      u.id AS user_id, 
      u.username, 
      u.nama AS nama_pj, 
      u.jabatan, 
      u.email AS email_pj, 
      u.hp AS hp_pj,
      p.nama AS nama_perusahaan, 
      p.email AS email_perusahaan, 
      p.hp AS telp_perusahaan, 
      p.alamat AS alamat_perusahaan
    FROM users u
    LEFT JOIN perusahaan p ON u.id = p.users_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ DB Error:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "DB Error", error: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Mitra tidak ditemukan" });
    }

    res.json({ success: true, data: rows[0] });
  });
});


router.post("/view", (req, res) => {
  try {
    
    const {
      status_pengajuan,
      cari_value,
      data_ke,
      page_limit,
      tipe: tipeFromBody, 
      perusahaan_id,
      bidang_usaha_id,
      bidang_force_id,
    } = req.body;

    // ambil identitas & role dari token (middleware auth kamu)
    const viewerId =
      req.user?.id || req.user?._id || req.user?.users_id || null;
    const role =
      (req.user && req.user.profile && req.user.profile.menu_klp) != null
        ? parseInt(req.user.profile.menu_klp)
        : (tipeFromBody != null ? parseInt(tipeFromBody) : 1); // fallback

    let where = "WHERE 1=1";

    // 🔒 Enforce: jika perusahaan (role 4), hanya lihat pengajuan miliknya
    if (role === 4 && viewerId) {
      where += ` AND km.perusahaan_id = ${db.escape(viewerId)}`;
    }

    // 🔎 Filter status_pengajuan
    if (status_pengajuan !== undefined && status_pengajuan !== null && status_pengajuan !== "") {
      where += ` AND km.status_pengajuan = ${db.escape(parseInt(status_pengajuan))}`;
    }

    // 🔎 Filter bidang usaha perusahaan
    if (bidang_usaha_id !== undefined && bidang_usaha_id !== null && bidang_usaha_id !== "") {
      where += ` AND p.bidang_usaha_id = ${db.escape(parseInt(bidang_usaha_id))}`;
    }

    // 🔎 Filter perusahaan
    if (perusahaan_id !== undefined && perusahaan_id !== null && perusahaan_id !== "") {
      where += ` AND km.perusahaan_id = ${db.escape(perusahaan_id)}`;
    }

    // 🔎 Filter bidang CSR
    if (bidang_force_id) {
      where += ` AND fm.bidang_force_id = ${db.escape(bidang_force_id)} `;
    }


    // 🔎 Pencarian (nama program / perusahaan)
    if (cari_value && String(cari_value).trim() !== "") {
      where += ` AND (fm.nama_csr LIKE ${db.escape('%' + cari_value + '%')}
                  OR p.nama LIKE ${db.escape('%' + cari_value + '%')})`;
    }

    // 📄 Pagination
    const pageFirst = parseInt(data_ke) > 0 ? parseInt(data_ke) : 1;
    const pageLimit = parseInt(page_limit) > 0 ? parseInt(page_limit) : 10;
    const offset = (pageFirst - 1) * pageLimit;

    const baseFrom = `
      FROM kegiatan_mitra_fm km
      LEFT JOIN force_majeure fm ON km.kegiatan_id = fm.id
      LEFT JOIN master_force_majeure b ON fm.bidang_force_id = b.id
      LEFT JOIN master_kecamatan mkc ON fm.kecamatan_id = mkc.kecamatan_id
      LEFT JOIN master_des_kel md ON fm.desa_id = md.des_kel_id
      LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
      LEFT JOIN master_bidang_usaha bu ON p.bidang_usaha_id = bu.id
      LEFT JOIN users u ON p.users_id = u.id
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      ${baseFrom}
      ${where}
    `;

    const dataSql = `
      SELECT 
        km.id,
        km.status_pengajuan,
        km.jumlah_ambil,
        km.catatan_admin,
        km.createdAt AS tgl_pengajuan,

        -- Info Program
        fm.nama_csr AS nama_kegiatan,
        b.uraian AS uraian_bidang_csr,
        fm.jumlah,
        fm.jumlah_sisa,
        fm.satuan,
        fm.nilai,
        fm.tanggal_mulai,
        fm.tanggal_selesai,
        fm.alamat,
        fm.file_name AS file_name,
        mkc.nama_kecamatan,
        md.nama_des_kel AS nama_desa,

        -- Info Perusahaan
        p.nama AS nama_perusahaan,
        p.bidang_usaha_id,
        bu.uraian AS bidang_perusahaan,
        p.email AS email_perusahaan,
        p.hp AS telp_perusahaan,
        p.alamat AS alamat_perusahaan,

        -- Info Penanggung Jawab
        u.nama AS nama_pj,
        u.jabatan AS jabatan_pj,
        u.email AS email_pj,
        u.hp AS hp_pj

      ${baseFrom}
      ${where}
      ORDER BY km.createdAt DESC
      LIMIT ${offset}, ${pageLimit};
    `;

    db.query(countSql, (err, countRows) => {
      if (err) {
        console.error("❌ DB Error (count):", err.sqlMessage);
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }
      const total = countRows[0]?.total || 0;

      db.query(dataSql, (err2, rows) => {
        if (err2) {
          console.error("❌ DB Error (data):", err2.sqlMessage);
          return res.status(500).json({ success: false, message: "DB Error", error: err2 });
        }

        res.json({ success: true, data: rows, total });
      });
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});


router.post('/approvePengajuan', async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  if (!id) return res.json({ success: false, message: "ID pengajuan dibutuhkan" });

  try {
    // Ambil data pengajuan
    const [pengajuan] = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM kegiatan_mitra_fm WHERE id = ?`, [id], (err, rows) => err ? reject(err) : resolve(rows));
    });

    if (!pengajuan) return res.json({ success: false, message: "Pengajuan tidak ditemukan" });

    // Update status pengajuan menjadi diterima
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE kegiatan_mitra_fm SET status_pengajuan = 2, catatan_admin = 'Disetujui oleh admin', editedAt = NOW(), editedBy = ? WHERE id = ?`,
        [userId, id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    // Ambil data program CSR
    const [program] = await new Promise((resolve, reject) => {
      db.query(`SELECT jumlah, jumlah_sisa FROM force_majeure WHERE id = ?`, [pengajuan.kegiatan_id], (err, rows) => err ? reject(err) : resolve(rows));
    });

    if (!program) return res.json({ success: false, message: "Program CSR tidak ditemukan" });

    // Hitung sisa jumlah
    const sisaBaru = program.jumlah_sisa - pengajuan.jumlah_ambil;

    // Tentukan status program
    let statusProgram;
    if (sisaBaru <= 0) statusProgram = 2;         // Dalam pengerjaan
    else if (sisaBaru < program.jumlah) statusProgram = 3; // Pengerjaan sebagian
    else statusProgram = 1;                        // Program CSR Baru

    // Update jumlah_sisa dan status program
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE force_majeure SET jumlah_sisa = ?, status = ? WHERE id = ?`,
        [sisaBaru, statusProgram, pengajuan.kegiatan_id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    res.json({ success: true, message: "Pengajuan berhasil disetujui" });

  } catch (err) {
    console.error("❌ Error approvePengajuan:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});



// FILE: routes/list_pengajuan.js
router.post('/tolakPengajuan', async (req, res) => {
  try {
    const { id, catatan_admin } = req.body;
    const userId = req.user.id; // dari middleware auth

    if (!id) return res.json({ success: false, message: "ID pengajuan dibutuhkan" });
    if (!catatan_admin) return res.json({ success: false, message: "Catatan admin harus diisi" });

    const query = `
      UPDATE kegiatan_mitra_fm
      SET status_pengajuan = 3, 
          catatan_admin = ?, 
          editedAt = NOW(), 
          editedBy = ?
      WHERE id = ?
    `;

    db.query(query, [catatan_admin, userId, id], (err, result) => {
      if (err) {
        console.error("❌ Error tolakPengajuan:", err.sqlMessage);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server", error: err });
      }

      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Pengajuan berhasil ditolak" });
      } else {
        res.json({ success: false, message: "Pengajuan tidak ditemukan" });
      }
    });

  } catch (err) {
    console.error("❌ Server Error tolakPengajuan:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err });
  }
});


router.post("/uploadEviden", upload.single("file"), (req, res) => {
  try {
    const { id, keterangan } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "File tidak ditemukan" });
    }

    const sql = `
      INSERT INTO bukti_dukung_fm (kegiatan_mitra_fm_id, file_name, keterangan) 
      VALUES (?, ?, ?)
    `;

    db.query(sql, [id, file.filename, keterangan], (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ success: false, message: "DB error" });
      }
      return res.json({
        success: true,
        message: "Upload berhasil",
        data: {
          kegiatan_mitra_fm_id: id,
          file_name: file.filename,
          keterangan,
        },
      });
    });
  } catch (err) {
    console.error("❌ ERROR Upload:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
// ================== GET ==================
router.get('/getEviden', (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ success: false, message: "id tidak boleh kosong" })

  const sql = `SELECT * FROM bukti_dukung_fm WHERE kegiatan_mitra_fm_id = ? ORDER BY createdAt DESC`
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err)
      return res.status(500).json({ success: false, message: "DB Error" })
    }
    res.json(results)
  })
})

router.post("/removeEviden", (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ success: false, message: "id tidak boleh kosong" });

  // cari dulu data file
  const sqlSelect = "SELECT file_name FROM bukti_dukung_fm WHERE id = ?";
  db.query(sqlSelect, [id], (err, results) => {
    if (err) return res.json({ success: false, message: "DB Error" });
    if (results.length === 0) return res.json({ success: false, message: "Data tidak ditemukan" });

    const filePath = path.join(__dirname, "../../uploads", results[0].file_name);

    // hapus file kalau ada
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // hapus dari DB
    const sqlDelete = "DELETE FROM bukti_dukung_fm WHERE id = ?";
    db.query(sqlDelete, [id], (err2) => {
      if (err2) return res.json({ success: false, message: "Gagal hapus data" });
      res.json({ success: true });
    });
  });
});

router.get('/lihatEviden/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const [rows] = await db.query(
          `SELECT file_name, keterangan, createdAt FROM bukti_dukung_fm WHERE kegiatan_mitra_fm_id = ?`,
          [id]
      );
      res.json({ success: true, data: rows });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

router.post("/selesaikanProgram", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: "id tidak boleh kosong" });

  const sql = `
    UPDATE force_majeure fm
    JOIN kegiatan_mitra_fm km ON fm.id = km.kegiatan_id
    SET fm.status = 4
    WHERE km.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, message: "DB Error" });
    }
    res.json({ success: true, message: "Program berhasil diselesaikan" });
  });
});




module.exports = router;