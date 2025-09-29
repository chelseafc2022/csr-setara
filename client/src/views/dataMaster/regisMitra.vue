<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Registrasi Mitra</div>
            <!-- <div class="text-subtitle2">Program/Kegiatan</div> -->
          </div>
          <div class="col-12 col-md-2"></div>
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square :dense="true" class="bg-white" style="width:90%"/>
              <q-btn v-if="tipe===1" glossy class="main1" @click="mdl_add = true" dense flat icon="add" style="width:10%">
                  <q-tooltip content-class="bg-cyan-9" content-style="font-size: 13px">
                    Click untuk menambah data
                  </q-tooltip>
              </q-btn>
            </div>

          </div>
        </div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <!-- <hr class="hrpagin2"> -->

        <div class="row">
            <div class="col-12" v-if="tipe === 1 || tipe === 5">
              <span class="h_lable">Bidang Usaha</span>
              <select v-model="filterku.master_bidang_usaha" @change="getView()" class="bg-white">
                <option value="">-- SEMUA BIDANG --</option>
                <option v-for="data in list_bidang" :key="data.id" :value="data.id">
                  🔹 {{ data.uraian }}
                </option>
              </select>
            </div>
          </div>

          <hr class="hrpagin2">
        <div class="tbl_responsive">
          <table width="100%">
            <thead class="h_table_head main1 text-white">
              <tr>
                <th width="5%" class="text-center">No</th>
                <th width="20%">Nama Perusahaan</th>
                <th width="15%">Bidang Usaha</th>
                <th width="15%">Email</th>
                <th width="10%">No HP</th>
                <th width="25%">Alamat</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in list_data" :key="data.id+'-'+index">
                <td class="text-center">{{ indexing(index+1) }}</td>
                <td>{{ data.nama }}
                  <div class="h_nip text-blue cursor-pointer" @click="lihatPIC(data.users_id)">
                    Lihat PIC
                  </div>
                </td>
                <td>{{ data.bidang_usaha }}</td>
                <td>{{ data.email }}</td>
                <td>{{ data.hp }}</td>
                <td>{{ data.alamat }}</td>
                <td class="text-center">
                  <!-- <q-btn-group flat>
                    <q-btn icon="edit" color="orange" @click="editModal(data)" round>
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn icon="visibility" color="primary" @click="lihatModal(data)" round>
                      <q-tooltip>Lihat</q-tooltip>
                    </q-btn>
                  </q-btn-group> -->
                  <q-btn-group>
                    <q-btn @click="mdl_password = true, selectData(data)" glossy color="blue" icon="vpn_key" class="tbl_btn">
                      <q-tooltip content-class="bg-blue-9" content-style="font-size: 13px">
                        Click untuk mengubah password pengguna ini
                      </q-tooltip>
                    </q-btn>
                    <q-btn @click="editModal(data)" glossy color="orange" icon="create" class="tbl_btn">
                      <q-tooltip content-class="bg-orange-9" content-style="font-size: 13px">
                        Click untuk mengubah data ini
                      </q-tooltip>
                    </q-btn>
                    <q-btn @click="mdl_hapus = true, selectData(data)" glossy color="negative" icon="delete_forever" class="tbl_btn">
                      <q-tooltip content-class="bg-red" content-style="font-size: 13px">
                        Click untuk menghapus data ini
                      </q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-center q-mt-md">
          <q-pagination
            v-model="page_first"
            :max="page_last"
            @update:model-value="getView()"
            color="grey-6"
            :max-pages="4"
            :direction-links="true"
            :boundary-links="true"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- ================= MODAL TAMBAH ================= -->
    <q-dialog v-model="mdl_add" persistent>
      <q-card class="mdl-md">
        <q-card-section class="main1">
          <div class="text-h6">Tambah Perusahaan</div>
        </q-card-section>
        <form @submit.prevent="addData">
          <q-card-section>
            <q-input v-model="form.nama" label="Nama Perusahaan" outlined dense class="q-mb-sm"/>
            <q-select
              v-model="form.bidang_usaha_id"
              :options="list_bidang"
              option-value="id"
              option-label="uraian"
              label="Bidang Usaha"
              outlined dense class="q-mb-sm"
            />
            <q-input v-model="form.email" label="Email" type="email" outlined dense class="q-mb-sm"/>
            <q-input v-model="form.hp" label="No HP" type="tel" outlined dense class="q-mb-sm"/>
            <q-input v-model="form.alamat" label="Alamat" type="textarea" outlined dense class="q-mb-sm"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Simpan" type="submit" color="primary" :loading="btn_add"/>
            <q-btn label="Batal" color="negative" v-close-popup/>
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>

    <!-- ================= MODAL EDIT ================= -->
<q-dialog v-model="mdl_edit" persistent>
  <q-card class="mdl-md">
    <q-card-section class="bg-orange">
      <div class="text-h6 h_modalhead">Edit Data Perusahaan</div>
    </q-card-section>

    <form @submit.prevent="editData">
      <q-card-section>

        <!-- ===== Data Perusahaan ===== -->
        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">Nama</span>
          <q-input v-model="form.nama" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable">Bidang Usaha</span>
          <select v-model="form.bidang_usaha_id" class="bg-white">
            <option value="" disabled>Pilih Bidang Usaha</option>
            <option 
              v-for="item in list_bidang" 
              :key="item.id" 
              :value="item.id">
              {{ item.uraian }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">No Hp</span>
          <q-input v-model="form.hp" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">Alamat</span>
          <q-input v-model="form.alamat" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <!-- ===== Separator ===== -->
        <hr class="hrpagin2 q-my-md">

        <!-- ===== Data PIC ===== -->
        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">Nama PIC</span>
          <q-input v-model="form.pic_nama" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">Jabatan PIC</span>
          <q-input v-model="form.pic_jabatan" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">Email PIC</span>
          <q-input v-model="form.pic_email" type="email" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

        <div class="col-12 col-md-12 frame_cari">
          <span class="h_lable ">No HP PIC</span>
          <q-input v-model="form.pic_hp" type="tel" outlined square :dense="true" class="bg-white margin_btn" />
        </div>

      </q-card-section>

      <q-card-actions align="right" class="bg-grey-4 mdl-footer">
        <q-btn label="Simpan" type="submit" color="primary" :loading="btn_edit"/>
        <q-btn label="Batal" color="negative" v-close-popup/>
      </q-card-actions>
    </form>
  </q-card>
</q-dialog>


    <!-- ================= MODAL Lihat PIC ================= -->
    <q-dialog v-model="mdl_pic" persistent>
      <q-card class="q-pa-md" style="max-width: 480px; border-radius: 18px; overflow: hidden;">
        <q-card-section class="text-center text-white" style="background: linear-gradient(135deg, #1976D2, #42A5F5);">
          <q-avatar size="100px" class="q-mb-sm shadow-2" style="border: 3px solid white;">
            <img v-if="pic_data?.foto" :src="pic_data.foto" alt="Foto PIC"/>
            <q-icon v-else name="person" size="80px" color="white"/>
          </q-avatar>
          <div class="text-h6">{{ pic_data?.nama }}</div>
          <div class="text-subtitle2">{{ pic_data?.jabatan }}</div>
        </q-card-section>
        <q-card-section class="bg-grey-2">
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="email" size="22px" class="q-mr-sm text-primary"/>
            <span>{{ pic_data?.email || '-' }}</span>
          </q-card>
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="phone" size="22px" class="q-mr-sm text-green"/>
            <span>{{ pic_data?.hp || '-' }}</span>
          </q-card>
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="badge" size="22px" class="q-mr-sm text-indigo"/>
            <span>Username: {{ pic_data?.username }}</span>
          </q-card>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn label="Tutup" flat color="negative" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ================= MODAL Lihat PIC ================= -->

    <!-- ================================================= MODAL PASSWORD ================================================ -->
    <q-dialog v-model="mdl_password" persistent>
                <q-card class="mdl-md">
                  <q-card-section class="bg-blue">
                    <div class="text-h6 h_modalhead text-center">Edit Password</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                        <br>
                        <div class="row">

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Password</span>
                            <q-input v-model="dataku.password" type="password" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Confirm Password</span>
                            <q-input v-model="dataku.confirmPassword" type="password" outlined square :dense="true" class="bg-white margin_btn" />
                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <div class="bg-red text-center" v-if="errorMessage" style="padding:2%">
                              <span style="color:white">{{ errorMessage }}</span>
                            </div>
                          </div>

                        </div>

                  </q-card-section>

                  <q-card-actions class="bg-grey-4 mdl-footer" align="right">
                    
                      <q-btn color="primary" @click="editDataPassword()" label="Simpan" />
                      <q-btn label="Batal" color="negative" v-close-popup />
             
                  </q-card-actions>
                </q-card>
              </q-dialog>
            <!-- ================================================= MODAL PASSWORD ================================================ -->
<!-- ================================================ MODAL HAPUS ================================================ -->
<q-dialog v-model="mdl_hapus" persistent>
                <q-card class="mdl-sm ">
                  <q-card-section class="q-pt-none text-center orageGrad">
                      <form @submit.prevent="hapusData">
                          <br>
                          <img src="img/alert.png" alt="" width="75"> <br>
                          <span class="h_notifikasi">APAKAH ANDA YAKIN INGIN MENGHAPUS DATA INI??</span>
                          <input type="submit" style="position: absolute; left: -9999px"/>
                          <br>
                          <br>

                        <q-btn label="Batal" size="sm" color="negative"  v-close-popup/>
                        &nbsp;
                        <q-btn type="submit" label="Hapus" size="sm" color="primary" v-close-popup/>

                      </form>
                  </q-card-section>
                </q-card>
              </q-dialog>
            <!-- ================================================ MODAL HAPUS ================================================ -->


  </div>
</template>


<script>
export default {
  data() {
    return {
  
      list_data: [],
      list_bidang: [],
      form: {
        id: null,
        nama: '',
        bidang_usaha_id: '',
        email: '',
        hp: '',
        alamat: ''
      },
      tipe: null, // simpan tipe user
      page_first: 1,
      page_last: 0,
      page_limit: 10,
      cari_value: '',
      mdl_add: false,
      mdl_edit: false,
      mdl_hapus: false,
      mdl_pic: false,
      pic_data: null,
      btn_add: false,
      btn_edit: false,
      filterku: {
          master_bidang_usaha: ''  // filter pakai bidang
        },
        list_bidang : [],

        mdl_password: false,
        dataku: {
          users_id: '',
          password: '',
          confirmPassword: ''
        },
        errorMessage: '',
    }
  },
  methods: {
    getBidang() {
      fetch("/api/bidang_usaha")
        .then(res => res.json())
        .then(res_data => {
          this.list_bidang = res_data.data || [];
        });
    },
    getView() {

      const body = {
    page_limit: this.page_limit,
    data_ke: (this.page_first - 1) * this.page_limit,
    cari_value: this.cari_value,
    master_bidang_usaha: this.filterku.master_bidang_usaha
  };

  if (this.tipe === 4) {
  // const userId = JSON.parse(localStorage.profile).profile.id;
  // body.users_id = userId;
  const profile = JSON.parse(localStorage.profile);
  console.log("User tipe 4, kirim users_id:", profile);
body.users_id = profile._id; // pakai ini
}

  fetch(this.$store.state.url.DATA_MITRA + "listRegis", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "kikensbatara " + localStorage.token
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res_data => {
    this.list_data = res_data.data;
    this.jml_data = res_data.jml_data;
    this.total_data = res_data.total_data;
    this.page_last = Math.ceil(this.total_data / this.page_limit);
  });
},
    addData() {
      this.btn_add = true;
      fetch("/api/perusahaan/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(this.form)
      })
      .then(() => {
        this.btn_add = false;
        this.mdl_add = false;
        this.getView();
      });
    },
    editData() {
      this.btn_edit = true;
      fetch("/api/perusahaan/edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(this.form)
      })
      .then(() => {
        this.btn_edit = false;
        this.mdl_edit = false;
        this.getView();
      });
    },
    lihatPIC(users_id) {
          fetch(this.$store.state.url.DATA_MITRA + "viewPIC", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({ users_id })
          })
            .then(res => res.json())
            .then(res_data => {
              if (res_data.success) {
                this.pic_data = res_data.data;
                this.mdl_pic = true;
              } else {
                this.$q.notify({ type: "negative", message: res_data.message });
              }
            })
            .catch(err => {
              console.error(err);
              this.$q.notify({ type: "negative", message: "Gagal ambil data PIC" });
            });
        },

    getBidang() {
        fetch(this.$store.state.url.DATA_MITRA + "viewBidang", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({})
        })
          .then(res => res.json())
          .then(res_data => {
            console.log("📌 hasil bidang:", res_data); // debug
            this.list_bidang = res_data.data || [];
          });
      },

  
  // ... method lain sudah ada
  selectData(data) {
    // ambil data user saat klik tombol edit password
    this.dataku = {
      users_id: data.users_id,
      password: '',
      confirmPassword: ''
    };
    this.errorMessage = '';

  },

  selectData(data) {
      this.dataku = {
        users_id: data.users_id,
        password: '',
        confirmPassword: ''
      };
      this.errorMessage = '';
      this.form = {
        ...data,
        users_id: data.users_id,
        id: data.id // id perusahaan
      };
    },

  async editDataPassword() {
    this.errorMessage = '';

    // validasi password
    if (!this.dataku.password || !this.dataku.confirmPassword) {
      this.errorMessage = "Password dan Confirm Password wajib diisi!";
      return;
    }

    if (this.dataku.password !== this.dataku.confirmPassword) {
      this.errorMessage = "Password dan Confirm Password tidak sama!";
      return;
    }

    try {
      const res = await fetch(this.$store.state.url.DATA_MITRA + "editPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({
          users_id: this.dataku.users_id,
          password: this.dataku.password
        })
      });

      const data = await res.json();

      if (data.success) {
        this.$q.notify({ type: "positive", message: "Password berhasil diubah!" });
        this.mdl_password = false; // tutup modal
      } else {
        this.errorMessage = data.message || "Gagal mengubah password!";
      }
    } catch (error) {
      console.error(error);
      this.errorMessage = "Terjadi kesalahan saat mengubah password.";
    }
  },

  editData() {
  this.btn_edit = true;
  fetch(this.$store.state.url.DATA_MITRA + "EditMitra", {
    method: "POST",
    headers: {
          "Content-Type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
    body: JSON.stringify({
      users_id: this.form.users_id,
      perusahaan_id: this.form.id,
      password: this.form.password || "", // optional
      nama: this.form.pic_nama,
      jabatan: this.form.pic_jabatan,
      pic_email: this.form.pic_email,
      pic_hp: this.form.pic_hp,
      perusahaan_nama: this.form.nama,
      bidang_usaha_id: this.form.bidang_usaha_id,
      perusahaan_email: this.form.email,
      perusahaan_hp: this.form.hp,
      alamat: this.form.alamat
    })
  })
  .then(res => res.json())
  .then(res_data => {
    this.btn_edit = false;
    if(res_data.success){
      this.mdl_edit = false;
      this.getView();
      this.$q.notify({ type: 'positive', message: res_data.message });
    } else {
      this.$q.notify({ type: 'negative', message: res_data.error || 'Gagal update' });
    }
  })
  .catch(err => {
    this.btn_edit = false;
    this.$q.notify({ type: 'negative', message: 'Terjadi kesalahan' });
  });
},
    indexing(idx) {
      return ((this.page_first-1)*this.page_limit)+idx;
    },
    editModal(data) {
  this.form = {
    ...data,
    pic_nama: data.nama_pic || '',
    pic_jabatan: data.jabatan || '',
    pic_email: data.email_pic || '',
    pic_hp: data.hp_pic || ''
  };
  this.mdl_edit = true;
},

hapusData() {
    this.btn_hapus = true;
    fetch(this.$store.state.url.DATA_MITRA + "hapusmitra", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
      body: JSON.stringify({
        users_id: this.form.users_id,      // harus ada
      perusahaan_id: this.form.id    
      })
    })
    .then(res => res.json())
    .then(res_data => {
      this.btn_hapus = false;
      if(res_data.success){
        this.mdl_hapus = false;
        this.getView(); // refresh tabel
        this.$q.notify({ type: 'positive', message: res_data.message });
      } else {
        this.$q.notify({ type: 'negative', message: res_data.error || 'Gagal hapus' });
      }
    })
    .catch(err => {
      this.btn_hapus = false;
      this.$q.notify({ type: 'negative', message: 'Terjadi kesalahan' });
    });
  },
    lihatModal(data) {
      this.lihatPIC(data.users_id);
    },
    cari_data() { this.page_first = 1; this.getView(); }
  },
  mounted() {
    const get_profile = JSON.parse(localStorage.profile);
        this.tipe = Number(get_profile.profile.db_csrkonsel); // ambil db_csrkonsel
    this.getView();
    this.getBidang();
  }
}
</script>
