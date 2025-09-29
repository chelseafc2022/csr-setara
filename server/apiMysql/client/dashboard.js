const express = require('express');
var db = require('../../db/MySql/umum');


const fs = require('fs');

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


router.post('/statusPengajuan', (req, res) => {
    const users_id = req.body.users_id;
    if (!users_id) {
      return res.status(400).json({ error: true, message: "users_id wajib dikirim" });
    }
  
    // Hitung jumlah pengajuan per status langsung berdasarkan perusahaan_id = users_id
    const sqlKegiatan = `
      SELECT 
        SUM(CASE WHEN status_pengajuan = 1 THEN 1 ELSE 0 END) AS diproses,
        SUM(CASE WHEN status_pengajuan = 2 THEN 1 ELSE 0 END) AS diterima,
        SUM(CASE WHEN status_pengajuan = 3 THEN 1 ELSE 0 END) AS ditolak,
        COUNT(*) AS total_pengajuan
      FROM kegiatan_mitra
      WHERE perusahaan_id = ?
    `;
  
    db.query(sqlKegiatan, [users_id], (err, result) => {
      if (err) return res.status(500).json(err);
  
      res.json({ data: result[0] });
    });
  });

  router.post('/bidangCSR', (req, res) => {
    const users_id = req.body.users_id;
    if (!users_id) return res.status(400).json({ error: true, message: "users_id wajib dikirim" });
  
    // Ambil perusahaan_id dari users_id
    const sqlPerusahaan = `SELECT id FROM perusahaan WHERE users_id = ? LIMIT 1`;
    db.query(sqlPerusahaan, [users_id], (err, perusahaan) => {
      if (err) return res.status(500).json(err);
      if (perusahaan.length === 0) return res.json({ data: [] });
  
      const perusahaan_id = perusahaan[0].id;
  
      const sql = `
      SELECT 
            b.id AS bidang_id,
            b.uraian AS nama_bidang,
            IFNULL(COUNT(km.id), 0) AS total_pengajuan
      FROM master_bidang_csr b
      LEFT JOIN kegiatan_csr kc ON kc.bidang_csr_id = b.id
      LEFT JOIN kegiatan_mitra km 
          ON km.kegiatan_id = kc.id 
          AND km.perusahaan_id = ?
      GROUP BY b.id, b.uraian
      ORDER BY b.uraian
      `;
      
      db.query(sql, [users_id], (err2, result) => {
          if (err2) return res.status(500).json(err2);
          res.json({ data: result });
          console.log("users_id yang dihitung:", users_id);
      });
    });
  });


  router.get('/statusAdmin', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) AS total_kegiatan,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS csr_baru,
            SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS dalam_pengerjaan,
            SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS pengerjaan_sebagian,
            SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) AS selesai
        FROM kegiatan_csr
    `;
    db.query(sql, (err, result) => {
        if(err) return res.status(500).json({ error: true, message: err });
        res.json({ data: result[0] });
    });
});

router.get('/perusahaanPartisipasi', (req, res) => {
    const sql = `
    SELECT 
            p.nama AS nama_perusahaan,
            COUNT(km.id) AS jumlah
        FROM perusahaan p
        LEFT JOIN kegiatan_mitra km ON km.perusahaan_id = p.users_id
        GROUP BY p.users_id, p.nama
        ORDER BY jumlah DESC;

    `;
    db.query(sql, (err, rows) => {
      if(err) return res.status(500).json(err);
      res.json({ data: rows });
    });
  });

router.get('/bidangUsaha', (req, res) => {
    const sql = `
            SELECT 
            bu.id AS bidang_id,
            bu.uraian AS nama_bidang,
            IFNULL(COUNT(p.id), 0) AS jumlah
        FROM master_bidang_usaha bu
        LEFT JOIN perusahaan p ON p.bidang_usaha_id = bu.id
        GROUP BY bu.id, bu.uraian
        ORDER BY bu.uraian;

    `;
    db.query(sql, (err, rows) => {
      if(err) return res.status(500).json(err);
      res.json({ data: rows });
    });
  });

  router.get('/bidangCSR', (req, res) => {
    const sql = `
      SELECT 
        b.id AS bidang_id,
        b.uraian AS nama_bidang,
        IFNULL(COUNT(km.id), 0) AS total_pengajuan
      FROM master_bidang_csr b
      LEFT JOIN kegiatan_csr kc ON kc.bidang_csr_id = b.id
      LEFT JOIN kegiatan_mitra km ON km.kegiatan_id = kc.id
      GROUP BY b.id, b.uraian
      ORDER BY b.uraian
    `;
  
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ data: result });
      console.log("Data bidangCSR keseluruhan:", result);
    });
  });
  

module.exports = router;