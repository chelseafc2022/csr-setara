const express = require('express');
var db = require('../../db/MySql/umum');

const { sendMail, escapeHtml } = require('../library/mailer');


const fs = require('fs');
const path = require('path');

var multer=require("multer");
var upload = require('../../db/multer/image');

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();
const cron = require('node-cron');
const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },       // file lama (gambar/lampiran)
  { name: 'file_spec', maxCount: 1 }   // file baru (pdf spesifikasi)
]);

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

    console.log("MASTER kecmatan DIPANGGIL");
    var userx = req.user.profile
    // console.log(userx); 
    console.log(userx.kecamatan_id);
    
    var filter_akses = ''

    if (userx.menu_klp == 1) {
        // console.log("BISA AKSES SEMUA");
        filter_akses = ``
    } else {
        // console.log("TIDAK BISA AKSES SEMUA");
        filter_akses = ` AND master_kecamatan.kecamatan_id = '`+userx.kecamatan_id+`'` ;
    }

    // console.log(filter_akses);
    
    let view = ` 
        SELECT * FROM master_kecamatan
        WHERE master_kecamatan.kabupaten_id = 7405
        `+filter_akses+`
        ORDER BY nama_kecamatan
    `;

    // console.log(view);

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

router.post('/viewData', (req, res) => {
    try {
      
      const { status, kecamatan_id, desa_id, bidang_force_id, cari_value } = req.body;
      let page_first = parseInt(req.body.page_first || req.body.data_ke || 1);
      let page_limit = parseInt(req.body.page_limit || 9);
  
      let where = "WHERE 1=1 ";
  
      if(status) where += ` AND k.status = ${db.escape(status)} `;
      if(kecamatan_id) where += ` AND k.kecamatan_id = ${db.escape(kecamatan_id)} `;
      if(desa_id) where += ` AND k.desa_id = ${db.escape(desa_id)} `;
      if(bidang_force_id) where += ` AND k.bidang_force_id = ${db.escape(bidang_force_id)} `;
      if(cari_value) where += ` AND k.nama_csr LIKE ${db.escape('%' + cari_value + '%')} `;
  
      const offset = (parseInt(page_first) - 1) * parseInt(page_limit);

  
      const countSql = `SELECT COUNT(*) as total FROM  force_majeure k ${where}`;
      db.query(countSql, (err, countResult) => {
        if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });
        const total = countResult[0].total;
  
        const sql = `
          SELECT 
            k.*,
            kc.nama_kecamatan,
            ds.nama_des_kel AS nama_desa,
            b.uraian AS uraian_bidang_csr_force
          FROM  force_majeure k
          LEFT JOIN master_kecamatan kc ON k.kecamatan_id = kc.kecamatan_id
          LEFT JOIN master_des_kel ds ON k.desa_id = ds.des_kel_id
          LEFT JOIN master_force_majeure b ON k.bidang_force_id = b.id
          ${where}
          ORDER BY k.createdAt DESC
          LIMIT ${parseInt(offset)}, ${parseInt(page_limit)}
        `;
  
        db.query(sql, (err, rows) => {
          if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });
          res.json({ data: rows, total });
        });
      });
  
    } catch(error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ success: false, message: "Server Error", error });
    }
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
  
  

// router.post('/addData', upload.single("file"), (req, res) => {
//     try {
//       // console.log("📩 Data diterima:", req.body);
//       // console.log("📂 File diterima:", req.file);
  
//       const id = uniqid();
//       const fileName = req.file ? req.file.filename : null;
  
//       let insert = `
//         INSERT INTO force_majeure (
//           id, bidang_force_id, nama_csr, deskripsi,
//           jumlah, jumlah_sisa, satuan, nilai, tanggal_mulai, tanggal_selesai,
//           kecamatan_id, desa_id, alamat,
//           file_name,
//           status, createdBy, createdAt, editedBy, editedAt
//         ) VALUES (
//           '${id}',
//           '${req.body.bidang_force_id}',
//           '${req.body.nama_csr}',
//           '${req.body.deskripsi}',
//           '${req.body.jumlah}',
//           '${req.body.jumlah}',
//           '${req.body.satuan}',
//           '${req.body.nilai}',
//           '${req.body.tanggal_mulai}',
//           '${req.body.tanggal_selesai}',
//           '${req.body.kecamatan_id}',
//           '${req.body.desa_id}',
//           '${req.body.alamat}',
//           ${fileName ? `'${fileName}'` : 'NULL'},
//           1,
//           '${req.user._id}',
//           NOW(),
//           '${req.user._id}',
//           NOW()
//         )
//       `;
  
//       db.query(insert, (err, result) => {
//         if (err) {
//           console.error("❌ DB Error:", err.sqlMessage);
//           return res.status(500).json({ success: false, message: "DB Error", error: err });
//         }
  
//         console.log("✅ Insert sukses:", result);
//         res.json({ success: true, message: "Data berhasil disimpan", id, file: fileName });
//       });
  
//     } catch (error) {
//       console.error("❌ Server Error:", error);
//       res.status(500).json({ success: false, message: "Server Error", error });
//     }
//   });

router.post('/addData', uploadFields, (req, res) => {
  try {
    const id = uniqid();
    const imageFile = req.files?.file?.[0]?.filename || null;
    const specFile  = req.files?.file_spec?.[0]?.filename || null;

    const sql = `
      INSERT INTO force_majeure (
        id, bidang_force_id, nama_csr, deskripsi,
        jumlah, jumlah_sisa, satuan, nilai, tanggal_mulai, tanggal_selesai,
        kecamatan_id, desa_id, alamat,
        file_name, file_spec,
        status, createdBy, createdAt, editedBy, editedAt
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,NOW(),?,NOW())
    `;

    const params = [
      id,
      req.body.bidang_force_id,
      req.body.nama_csr,
      req.body.deskripsi,
      req.body.jumlah,
      req.body.jumlah,
      req.body.satuan,
      req.body.nilai,
      req.body.tanggal_mulai,
      req.body.tanggal_selesai,
      req.body.kecamatan_id,
      req.body.desa_id,
      req.body.alamat,
      imageFile,                    // file_name (lama)
      specFile,
      req.user._id,
      req.user._id
    ];

    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ success:false, message:'DB Error', error: err });
      res.json({ success: true, message: 'Data berhasil disimpan', id, file: imageFile, file_spec: specFile });
    });
  } catch (e) {
    res.status(500).json({ success:false, message:'Server Error', error: e });
  }
});


// ====================== EDIT DATA ======================
router.post('/editData', uploadFields, (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID tidak ditemukan' });
    }

    const toNullable = (v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).trim().toLowerCase();
      return (s === '' || s === 'null') ? null : v;
    };

    db.query('SELECT file_name FROM force_majeure WHERE id = ? LIMIT 1', [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'DB Error', error: err.message });
      }

      const oldImage = rows?.[0]?.file_name || null;
      const oldSpec  = rows?.[0]?.file_spec || null;

      const newImage = req.files?.file?.[0]?.filename || oldImage;
      const newSpec  = req.files?.file_spec?.[0]?.filename || oldSpec;

      const sql = `
        UPDATE force_majeure SET
          bidang_force_id=?, nama_csr=?, deskripsi=?,
          jumlah=?, jumlah_sisa=?, satuan=?, nilai=?, tanggal_mulai=?, tanggal_selesai=?,
          kecamatan_id=?, desa_id=?, alamat=?, file_name=?, file_spec=?,
          editedBy=?, editedAt=NOW()
        WHERE id=?
      `;

      const params = [
        req.body.bidang_force_id || null,
        req.body.nama_csr || '',
        req.body.deskripsi || '',
        req.body.jumlah ?? null,
        req.body.jumlah ?? null,  // jumlah_sisa diisi dengan nilai jumlah yang sama
        req.body.satuan || '',
        req.body.nilai ?? null,
        req.body.tanggal_mulai || null,
        req.body.tanggal_selesai || null,
        toNullable(req.body.kecamatan_id),
        toNullable(req.body.desa_id),
        toNullable(req.body.alamat),
        newImage,
        newSpec,
        req.user?._id || null,
        id
      ];

      db.query(sql, params, (err2, result) => {
        if (err2) {
          return res.status(500).json({ success: false, message: 'DB Error', error: err2.message });
        }
       // hapus file lama jika diganti
       const uploadDir = upload?.dest || 'uploads';
       if (req.files?.file && oldImage && oldImage !== newImage) {
         fs.unlink(`${uploadDir}/${oldImage}`, (unlinkErr) => {
           if (unlinkErr) console.error('Error deleting old image:', unlinkErr);
         });
       }
       if (req.files?.file_spec && oldSpec && oldSpec !== newSpec) {
         console.log('Deleting old spec file:', oldSpec);
         fs.unlink(`${uploadDir}/${oldSpec}`, (unlinkErr) => {
           if (unlinkErr) console.error('Error deleting old spec:', unlinkErr);
         });
       }

       res.json({ success:true, message:'Data berhasil diubah', affectedRows: result.affectedRows, file: newImage, file_spec: newSpec });
     });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});
  

  router.post('/removeData', (req, res) => {
    const id = req.body.id;
    if (!id) return res.status(400).json({ success: false, message: 'ID diperlukan' });
  
    db.query('SELECT file_name, file_spec FROM force_majeure WHERE id = ? LIMIT 1', [id], (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err });
  
      const fileImg  = rows?.[0]?.file_name || null;
      const fileSpec = rows?.[0]?.file_spec || null;
      const uploadDir = upload?.dest || 'uploads';
  
      const safeUnlink = (fname) => {
        if (!fname) return Promise.resolve();
        const fp = path.join(uploadDir, fname);
        return fs.promises.unlink(fp).catch(() => {}); 
      };
  
      Promise.all([ safeUnlink(fileImg), safeUnlink(fileSpec) ])
        .finally(() => {
          db.query('DELETE FROM force_majeure WHERE id = ?', [id], (err2, result) => {
            if (err2) return res.status(500).json({ success: false, error: err2 });
            res.json({ success: true, affectedRows: result.affectedRows, removedFiles: { file_name: fileImg, file_spec: fileSpec } });
          });
        });
    });
  });
  



// 📌 Mitra mengajukan pengambilan program
router.post("/addPengajuan", (req, res) => {
  try {
    const id = uniqid();
    const { kegiatan_id, perusahaan_id, jumlah_ambil, catatan_mitra } = req.body;


    // validasi sederhana
    if (!kegiatan_id || !perusahaan_id || !jumlah_ambil) {
      console.warn("⚠️ Data tidak lengkap:", req.body);
      return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    // Insert ke kegiatan_mitra, status_pengajuan = 1 (menunggu persetujuan)
    let insert = `
      INSERT INTO kegiatan_mitra_fm
      (id, kegiatan_id, perusahaan_id, jumlah_ambil, catatan_mitra, status_pengajuan, catatan_admin, createdBy, createdAt, editedBy, editedAt)
      VALUES (
        '${id}',
        '${kegiatan_id}',
        '${perusahaan_id}',
        '${jumlah_ambil}',
        ${catatan_mitra ? `'${catatan_mitra}'` : "NULL"},
        1,
        'Menunggu persetujuan admin',
        '${req.user._id}',
        NOW(),
        '${req.user._id}',
        NOW()
      )
    `;

  


    db.query(insert, (err) => {
      if (err) {
        console.error("❌ DB Insert Error:", err.sqlMessage);
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }


      // Tidak update jumlah_sisa dan status program di sini
      res.json({ success: true, message: "Pengajuan berhasil dikirim, menunggu persetujuan admin", id });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});



// Cron job setiap hari jam 00:00
cron.schedule('0 0 * * *', () => {
  const sql = `
    UPDATE kegiatan_csr
    SET status = 4
    WHERE tanggal_selesai < NOW()
      AND status != 4
  `;
  db.query(sql, (err, result) => {
    if(err) {
      console.error("❌ Error update status selesai:", err);
    } else {
      console.log(`✅ Cron update status selesai: ${result.affectedRows} program`);
    }
  });
});




module.exports = router;