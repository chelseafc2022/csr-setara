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
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square :dense="true" class="bg-white"
                style="width:90%" />
              <q-btn v-if="tipe === 1" glossy class="main1" @click="mdl_add = true" dense flat icon="add"
                style="width:10%">
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
                <th width="5%" class="text-center">Status</th>
                <th width="20%">Nama Perusahaan</th>
                <th width="15%">Bidang Usaha</th>
                <th width="10%">Email</th>
                <th width="5%">No HP</th>
                <th width="20%">Alamat</th>
                <th width="10%">Dokumen</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in list_data" :key="data.id + '-' + index">
                <td class="text-center">{{ indexing(index + 1) }}</td>
                <td class="text-center">
                  <a href="javascript:void(0)" class="removeTextDecoration" @click="lihatKeterangan(data)">
                    <q-btn v-if="data.status === 'pending'" round glossy size="xs" color="orange"
                      icon="hourglass_empty" />
                    <!-- Jika Anda ingin menyembunyikan tombol lain, hapus baris di bawah ini -->
                    <q-btn v-if="data.status === 'terima'" round size="xs" glossy color="green" icon="done" />
                    <q-btn v-if="data.status === 'ditolak'" round glossy size="xs" color="red" icon="close" />
                  </a>
                </td>
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
                  <q-btn-group>
                    <!-- Tombol Lihat Detil -->
                    <q-btn class="tbl_btn" glossy color="green" icon="document_scanner"
                      @click="openDocumentModal(data)">
                      <q-tooltip content-class="bg-green-9" content-style="font-size: 13px">
                        Lihat Dokumen
                      </q-tooltip>
                    </q-btn>

                  </q-btn-group>
                </td>
                <td class="text-center">
                  <q-item-section>
                    <div class="text-grey-8 q-gutter-xs text-center">
                      <q-btn glossy dense round icon="settings" color="red">
                        <q-menu>
                          <q-list dense style="min-width: 100px">
                            
                            <q-item clickable v-if="tipe === 1 || tipe === 5" v-close-popup
                              @click="approveRegistrasi(data.id)"
                              :disable="data.status === 'terima' || data.status === 'ditolak'">
                              <q-item-section>Setujui Registrasi</q-item-section>
                            </q-item>
                            <q-separator v-if="tipe === 1 || tipe === 5" />

                            <q-item clickable v-if="tipe === 1 || tipe === 5" v-close-popup
                              @click="tolakRegistrasi(data.id)"
                              :disable="data.status === 'terima' || data.status === 'ditolak'">
                              <q-item-section>Tolak Registrasi</q-item-section>
                            </q-item>
                            <q-separator v-if="tipe === 1 || tipe === 5" />

                            <q-item clickable v-close-popup @click="mdl_password = true; selectData(data)"
                              :disable="data.status === 'pending' || data.status === 'ditolak'">
                              <q-item-section>Edit Password</q-item-section>
                            </q-item>
                            <q-separator />

                            <q-item clickable v-close-popup @click="mdl_edit = true; selectData(data)"
                              :disable="data.status === 'pending' || data.status === 'ditolak'">
                              <q-item-section>Edit</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item clickable v-close-popup @click="mdl_hapus = true; selectData(data)"
                              :disable="data.status !== 'ditolak'">
                              <q-item-section>Hapus</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </q-item-section>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-center q-mt-md">
          <q-pagination v-model="page_first" :max="page_last" @update:model-value="getView()" color="grey-6"
            :max-pages="4" :direction-links="true" :boundary-links="true" />
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
            <q-input v-model="form.nama" label="Nama Perusahaan" outlined dense class="q-mb-sm" />
            <q-select v-model="form.bidang_usaha_id" :options="list_bidang" option-value="id" option-label="uraian"
              label="Bidang Usaha" outlined dense class="q-mb-sm" />
            <q-input v-model="form.email" label="Email" type="email" outlined dense class="q-mb-sm" />
            <q-input v-model="form.hp" label="No HP" type="tel" outlined dense class="q-mb-sm" />
            <q-input v-model="form.alamat" label="Alamat" type="textarea" outlined dense class="q-mb-sm" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Simpan" type="submit" color="primary" :loading="btn_add" />
            <q-btn label="Batal" color="negative" v-close-popup />
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
                <option v-for="item in list_bidang" :key="item.id" :value="item.id">
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
              <q-input v-model="form.pic_email" type="email" outlined square :dense="true"
                class="bg-white margin_btn" />
            </div>

            <div class="col-12 col-md-12 frame_cari">
              <span class="h_lable ">No HP PIC</span>
              <q-input v-model="form.pic_hp" type="tel" outlined square :dense="true" class="bg-white margin_btn" />
            </div>

          </q-card-section>

          <q-card-actions align="right" class="bg-grey-4 mdl-footer">
            <q-btn label="Simpan" type="submit" color="primary" :loading="btn_edit" />
            <q-btn label="Batal" color="negative" v-close-popup />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>


    <!-- ================= MODAL Lihat PIC ================= -->
    <q-dialog v-model="mdl_pic" persistent>
      <q-card class="q-pa-md" style="max-width: 480px; border-radius: 18px; overflow: hidden;">
        <q-card-section class="text-center text-white" style="background: linear-gradient(135deg, #1976D2, #42A5F5);">
          <q-avatar size="100px" class="q-mb-sm shadow-2" style="border: 3px solid white;">
            <img v-if="pic_data?.foto" :src="pic_data.foto" alt="Foto PIC" />
            <q-icon v-else name="person" size="80px" color="white" />
          </q-avatar>
          <div class="text-h6">{{ pic_data?.nama }}</div>
          <div class="text-subtitle2">{{ pic_data?.jabatan }}</div>
        </q-card-section>
        <q-card-section class="bg-grey-2">
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="email" size="22px" class="q-mr-sm text-primary" />
            <span>{{ pic_data?.email || '-' }}</span>
          </q-card>
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="phone" size="22px" class="q-mr-sm text-green" />
            <span>{{ pic_data?.hp || '-' }}</span>
          </q-card>
          <q-card flat bordered class="q-pa-sm row items-center">
            <q-icon name="badge" size="22px" class="q-mr-sm text-indigo" />
            <span>Username: {{ pic_data?.username }}</span>
          </q-card>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-3">
          <q-btn label="Tutup" flat color="negative" v-close-popup />
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
              <q-input v-model="dataku.password" type="password" outlined square :dense="true"
                class="bg-white margin_btn" />
            </div>

            <div class="col-12 col-md-12 frame_cari">
              <span class="h_lable ">Confirm Password</span>
              <q-input v-model="dataku.confirmPassword" type="password" outlined square :dense="true"
                class="bg-white margin_btn" />
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
            <input type="submit" style="position: absolute; left: -9999px" />
            <br>
            <br>

            <q-btn label="Batal" size="sm" color="negative" v-close-popup />
            &nbsp;
            <q-btn type="submit" label="Hapus" size="sm" color="primary" v-close-popup />

          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- ================================================ MODAL HAPUS ================================================ -->
    <!-- ===================== MODAL TOLAK ===================== -->

    <q-dialog v-model="mdl_catatan_admin" persistent>
      <q-card class="mdl-md">
        <q-card-section class="bg-orange text-white">
          <div class="text-h6">Tolak Pengajuan</div>
        </q-card-section>

        <q-card-section>
          <span class="h_lable">Alasan Penolakan</span>
          <!-- v-model langsung ke selectedItem.catatan_admin -->
          <q-input v-model="selectedItem.catatan_admin" outlined square dense type="textarea"
            class="bg-white q-mt-sm" />
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-4">
          <q-btn color="warning" label="Evaluasi" @click="submitTolak()" />
          <q-btn color="negative" label="Batal" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>




    <!-- ===================== MODAL TOLAK ===================== -->

    <!-- ========================== KETERANGAN ================================ -->
    <q-dialog v-model="mdl_keterangan" persistent>
      <q-card class="mdl-md">
        <q-card-section class="bg-orange">
          <div class="text-h6 h_modalhead">KETERANGAN</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <br>
          <span style="margin-top:100px">{{ selectedItem.catatan_admin }}</span>

        </q-card-section>

        <q-card-actions class="bg-grey-4 mdl-footer" align="right">

          <q-btn label="Close" color="negative" v-close-popup />

        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- ========================== KETERANGAN ================================ -->

    <!-- ================================================= MODAL OPEN ================================================ -->
    <q-dialog v-model="mdl_open" persistent>
      <q-card class="mdl-md">
        <q-card-section class="bg-green">
          <div class="text-h6 h_modalhead">Dokumen</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <br>
          <div class="text-center">
            <hr class="hrpagin2">
            <embed :src="file_path + selectedDocument.file_name" width="100%" height="600" type="application/pdf"
              @error="handleFileError">
            <!-- <p>Dokumen tidak dapat ditampilkan. <a :href="file_path + selectedDocument.file_name" target="_blank">Buka di tab baru</a></p> -->
            </embed>
            <hr class="hrpagin2">
          </div>
        </q-card-section>

        <q-card-actions class="bg-grey-4 mdl-footer" align="right">
          <!-- <q-btn color="primary" @click="downloadFile()" label="Download" /> -->
          <q-btn label="Kembali" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ================================================= MODAL OPEN ================================================ -->
    <!-- ================================================= MODAL SETUJUI ================================================ -->
    <q-dialog v-model="mdl_approve" persistent>
      <q-card class="mdl-md">
        <q-card-section class="bg-green">
          <div class="text-h6 h_modalhead">Setujui Registrasi</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="approve_form.username" label="Username" outlined dense class="q-mb-sm" />
          <q-input v-model="approve_form.password" label="Password" type="password" outlined dense class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-4">
          <q-btn label="Setujui" @click="submitApprove()" color="primary" />
          <q-btn label="Batal" v-close-popup color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ================================================= MODAL SETUJUI ================================================ -->
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
        alamat: '',
        status: ''
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
      mdl_catatan_admin: false,
      mdl_open: false,
      file_path: this.$store.state.url.URL_APP + "uploads/",
      selectedDocument: {
        file_name: ''
      },
      mdl_approve: false,
      approve_form: {
        username: '',
        password: ''
      },
      selectedItem: {},
      mdl_keterangan: false,
      pic_data: null,
      btn_add: false,
      btn_edit: false,
      btn_hapus: false,
      filterku: {
        master_bidang_usaha: ''  // filter pakai bidang
      },
      list_bidang: [],

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
    // getView() {

    //   const body = {
    //     page_limit: this.page_limit,
    //     data_ke: (this.page_first - 1) * this.page_limit,
    //     cari_value: this.cari_value,
    //     master_bidang_usaha: this.filterku.master_bidang_usaha
    //   };

    //   if (this.tipe === 4) {
    //     // const userId = JSON.parse(localStorage.profile).profile.id;
    //     // body.users_id = userId;
    //     const profile = JSON.parse(localStorage.profile);
    //     console.log("User tipe 4, kirim users_id:", profile);
    //     body.users_id = profile._id; // pakai ini
    //   }

    //   fetch(this.$store.state.url.DATA_MITRA + "listRegis", {
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json",
    //       authorization: "kikensbatara " + localStorage.token
    //     },
    //     body: JSON.stringify(body)
    //   })
    //     .then(res => res.json())
    //     .then(res_data => {
    //       this.list_data = res_data.data;
    //       this.jml_data = res_data.jml_data;
    //       this.total_data = res_data.total_data;
    //       this.page_last = Math.ceil(this.total_data / this.page_limit);
    //     });
    // },

    // getView() {
    //   const body = {
    //     page_limit: this.page_limit,
    //     data_ke: (this.page_first - 1) * this.page_limit,
    //     cari_value: this.cari_value,
    //     master_bidang_usaha: this.filterku.master_bidang_usaha,
    //   };

    //   fetch(this.$store.state.url.DATA_MITRA + "listRegis", {
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json",
    //       authorization: "kikensbatara " + localStorage.token
    //     },
    //     body: JSON.stringify(body)
    //   })
    //     .then(res => res.json())
    //     .then(res_data => {
    //       // console.log("Respons API listRegis:", res_data); 
    //       if (res_data.data && res_data.data.length > 0) {
    //         res_data.data.forEach(item => {
    //           // console.log("Item data.status:", item.status);  
    //         });
    //       } else {
    //         // console.log("list_data kosong atau tidak ada data");
    //       }
    //       this.list_data = res_data.data;
    //       this.jml_data = res_data.jml_data;
    //       this.total_data = res_data.total_data;
    //       this.page_last = Math.ceil(this.total_data / this.page_limit);
    //     })
    //     .catch(error => {
    //       console.error("Error fetching data:", error);
    //     });
    // },
    getView() {
  const body = {
    page_limit: this.page_limit,
    data_ke: (this.page_first - 1) * this.page_limit,
    cari_value: this.cari_value,
    master_bidang_usaha: this.filterku.master_bidang_usaha,
    tipe: this.tipe  // Tambahkan tipe user
  };

  // Jika tipe 4 (mitra), ambil users_id dari localStorage dan kirim
  if (this.tipe === 4) {
    const profile = JSON.parse(localStorage.profile);
    console.log('Profile structure:', profile);  // Debug: Cek struktur localStorage
    body.users_id = profile._id;  // Ubah ke _id (atau profile.profile._id jika nested)
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
      // console.log("Respons API listRegis:", res_data); 
      if (res_data.data && res_data.data.length > 0) {
        res_data.data.forEach(item => {
          // console.log("Item data.status:", item.status);  
        });
      } else {
        // console.log("list_data kosong atau tidak ada data");
      }
      this.list_data = res_data.data;
      this.jml_data = res_data.jml_data;
      this.total_data = res_data.total_data;
      this.page_last = Math.ceil(this.total_data / this.page_limit);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
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
          // console.log("📌 hasil bidang:", res_data); // debug
          this.list_bidang = res_data.data || [];
        });
    },

    selectData(data) {
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
        id: data.id 
      };
    },

    async editDataPassword() {
      this.errorMessage = '';

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
          this.mdl_password = false;
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
          password: this.form.password || "", 
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
          if (res_data.success) {
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
      return ((this.page_first - 1) * this.page_limit) + idx;
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
          users_id: this.form.users_id, 
          perusahaan_id: this.form.id
        })
      })
        .then(res => res.json())
        .then(res_data => {
          this.btn_hapus = false;
          if (res_data.success) {
            this.mdl_hapus = false;
            this.getView(); 
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
    cari_data() { this.page_first = 1; this.getView(); },

    lihatKeterangan: function (item) {
      this.selectedItem = { ...item };
      this.mdl_keterangan = true;
    },

    approveRegistrasi(id) {
      const item = this.list_data.find(d => d.id === id);
      if (!item) {
        this.Notify('Data tidak ditemukan', 'negative', 'warning');
        return;
      }
      this.selectedItem = { ...item };
      this.approve_form = { username: '', password: '' }; 
      this.mdl_approve = true;
    },

    async submitApprove() {
      if (!this.approve_form.username.trim() || !this.approve_form.password.trim()) {
        this.Notify('Username dan Password harus diisi', 'negative', 'warning');
        return;
      }

      try {
        const res = await fetch(this.$store.state.url.DATA_MITRA + "approveRegistrasi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
            id: this.selectedItem.id,
            username: this.approve_form.username,
            password: this.approve_form.password
          })
        });
        const data = await res.json();
        if (data.success) {
          this.Notify('Registrasi disetujui dan akun dibuat', 'positive', 'check_circle_outline');
          this.mdl_approve = false;
          this.getView();  
        } else {
          this.Notify(data.message || 'Gagal menyetujui registrasi', 'negative', 'error_outline');
        }
      } catch (err) {
        console.error(err);
        this.Notify('Terjadi kesalahan server', 'negative', 'error_outline');
      }
    },

    tolakRegistrasi(id) {
      const item = this.list_data.find(d => d.id === id);
      if (!item) {
        this.Notify('Data tidak ditemukan', 'negative', 'warning');
        return;
      }
      this.selectedItem = { ...item, catatan_admin: '' }; 
      this.mdl_catatan_admin = true;
    },

    async submitTolak() {
      if (!this.selectedItem.catatan_admin.trim()) {
        this.Notify('Catatan admin harus diisi', 'negative', 'warning');
        return;
      }

      const confirm = window.confirm('Apakah Anda yakin ingin menolak registrasi ini? Status akan berubah ke "ditolak".');
      if (!confirm) return;

      try {
        const res = await fetch(this.$store.state.url.DATA_MITRA + "tolakRegistrasi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "kikensbatara " + localStorage.token 
          },
          body: JSON.stringify({
            id: this.selectedItem.id,
            catatan_admin: this.selectedItem.catatan_admin
          })
        });
        const data = await res.json();
        if (data.success) {
          this.Notify('Registrasi ditolak dan catatan disimpan', 'negative', 'cancel');
          this.getView(); 
          this.mdl_catatan_admin = false;
        } else {
          this.Notify(data.message, 'negative', 'error_outline');
        }
      } catch (err) {
        console.error(err);
        this.Notify('Terjadi kesalahan server', 'negative', 'error_outline');
      }
    },

    Notify: function (message, positive, icon) {
      this.$q.notify({
        message: message,
        color: positive,
        icon: icon,
        position: 'top',
        timeout: 500,
      })
    },

    openDocumentModal(data) {
      console.log("Data yang diklik:", data);
      const fileName = data.file_name || ''; 
      this.selectedDocument = { file_name: fileName };
      this.mdl_open = true;  
    },


    handleFileError() {
      this.$q.notify({
        type: 'negative',
        message: 'Gagal memuat dokumen.',
        icon: 'error'
      });
    },

    // downloadFile() {
    //   if (this.selectedDocument.file_name) {
    //     const link = document.createElement('a');
    //     link.href = this.file_path + this.selectedDocument.file_name;
    //     link.download = this.selectedDocument.file_name;  
    //     link.click();
    //   } else {
    //     this.$q.notify({
    //       type: 'negative',
    //       message: 'File tidak tersedia.',
    //       icon: 'warning'
    //     });
    //   }
    // },

  },
  mounted() {
    const get_profile = JSON.parse(localStorage.profile);
    this.tipe = Number(get_profile.profile.db_csrkonsel); // ambil db_csrkonsel
    this.getView();
    this.getBidang();
  }
}
</script>
