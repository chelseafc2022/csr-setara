<template>
  <div class="about " style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Berita CSR</div>
          </div>
          <div class="col-12 col-md-2">

          </div>

          <!-- Cari + Tombol Add -->
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square dense class="bg-white col q-mr-sm" />
              <q-btn v-if="tipe == 1" glossy class="col-auto" color="amber" @click="mdl_add = true" dense icon="add">
                <q-tooltip content-class="bg-amber-7" content-style="font-size: 13px">
                  Click untuk menambah data
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

      </q-card-section>

    </q-card>


    <hr class="hrpagin2">

    <div class="tbl_responsive">
      <!-- =================================================== KONTENT =========================================================== -->
      <table width="100%">
        <tr class="h_table_head main1 text-white ">
          <th width="5%" class="text-center">No</th>
          <th width="10%">Foto</th>
          <th width="30%">Judul</th>
          <th width="40%">Deskripsi</th>
          <th width="15%" class="text-center">Act</th>
          <!-- <th width="30%">Keterangan</th> -->
          <!-- <th width="10%"></th> -->
        </tr>
        <tr class="h_table_body" v-for="(data, index) in list_data" :key="data.id">
          <td class="text-center">{{ indexing(index + 1) }}.</td>
          <td class="text-center">
            <img v-if="data.file_name" :src="file_path + data.file_name" alt="foto"
              style="max-width: 80px; border-radius: 6px; cursor: pointer;"
              @click="openImage(file_path + data.file_name)" />
            <q-icon v-else name="image_not_supported" size="sm" color="grey" />
          </td> <!-- Foto -->
          <td>
            <div class="text-bold">{{ data.judul }}</div>
            <div class="text-blue" style="font-size: 12px;">
              {{ data.sumber }}
            </div>
          </td> <!-- Judul -->

          <td>
            <div>{{ data.deskripsi }}</div>
          </td>


          <td class="text-center q-gutter-sm">
            <q-btn dense round color="warning" icon="edit" @click="openEdit(data)">
              <q-tooltip content-class="bg-amber-7">Edit Data</q-tooltip>
            </q-btn>
            <q-btn dense round color="negative" icon="delete" @click="openDelete(data)">
              <q-tooltip content-class="bg-red-7">Hapus Data</q-tooltip>
            </q-btn>
            <q-btn dense round color="primary" icon="visibility" @click="openLihat(data)">
              <q-tooltip content-class="bg-blue-7">Lihat Data</q-tooltip>
            </q-btn>
          </td> <!-- Act -->
        </tr>

      </table>

      <!-- =================================================== KONTENT =========================================================== -->
    </div>

    <hr class="hrpagin">
    <br>
    <div class="flex flex-center">
      <q-pagination v-model="page_first" :max="page_last" :max-pages="4" color="grey-6" :direction-links="true"
        :boundary-links="true" icon-first="skip_previous" icon-last="skip_next" icon-prev="fast_rewind"
        icon-next="fast_forward" @input="getView" />
    </div>

    <!-- ===================== MODAL ADD BERITA ===================== -->
    <q-dialog v-model="mdl_add" persistent>
      <q-card class="mdl-md">
        <q-card-section class="main2 text-white">
          <div class="text-h6 h_modalhead">Tambah Berita / CSR</div>
        </q-card-section>

        <form @submit.prevent="addData()">

          <q-card-section class="q-pt-none">

            <hr class="hrpagin2">

            <!-- Judul -->
            <span class="h_lable">Judul</span>
            <q-input v-model="form.judul" outlined square dense class="bg-white margin_btn" />

            <!-- Sumber -->
            <span class="h_lable">Sumber</span>
            <q-input v-model="form.sumber" outlined square dense class="bg-white margin_btn" />

            <!-- Deskripsi -->
            <span class="h_lable">Deskripsi Singkat</span>
            <q-input v-model="form.deskripsi" type="textarea" outlined square dense class="bg-white margin_btn" />

            <!-- Isi / Detail Berita -->
            <span class="h_lable">Isi</span>
            <q-editor v-model="form.isi" :toolbar="editorToolbar" placeholder="Tulis isi berita..." class="bg-white" />

            <!-- Lampiran File -->
            <span class="h_lable">Lampiran File</span>
            <q-file v-model="form.file_name" label="Pilih File" outlined square dense class="bg-white margin_btn" />

            <hr class="hrpagin2">

          </q-card-section>

          <q-card-actions class="bg-grey-4 mdl-footer" align="right">
            <q-btn :loading="btn_add" color="primary" type="submit" label="Simpan" />
            <q-btn label="Batal" color="negative" v-close-popup />
          </q-card-actions>

        </form>
      </q-card>
    </q-dialog>
    <!-- ===================== MODAL ADD BERITA ===================== -->

    <!-- ===================== MODAL EDIT BERITA ===================== -->
    <q-dialog v-model="mdl_edit" persistent>
      <q-card class="mdl-md">
        <q-card-section class="main2 text-white">
          <div class="text-h6 h_modalhead">Edit Berita / CSR</div>
        </q-card-section>

        <form @submit.prevent="updateData()">

          <q-card-section class="q-pt-none">

            <hr class="hrpagin2">

            <!-- Judul -->
            <span class="h_lable">Judul</span>
            <q-input v-model="form.judul" outlined square dense class="bg-white margin_btn" />

            <!-- Sumber -->
            <span class="h_lable">Sumber</span>
            <q-input v-model="form.sumber" outlined square dense class="bg-white margin_btn" />

            <!-- Deskripsi -->
            <span class="h_lable">Deskripsi Singkat</span>
            <q-input v-model="form.deskripsi" type="textarea" outlined square dense class="bg-white margin_btn" />

            <!-- Isi / Detail Berita -->
            <span class="h_lable">Isi</span>
            <q-editor v-model="form.isi" :toolbar="editorToolbar" placeholder="Tulis isi berita..." class="bg-white" />

            <!-- Lampiran File -->
            <!-- File Upload -->
            <span class="h_lable">Lampiran File</span>
            <q-file v-model="fileBaru" label="Pilih File Baru (opsional)" outlined square dense
              class="bg-white margin_btn" />

            <!-- Preview jika ada file lama -->
            <div v-if="form.file_name && !fileBaru" class="q-mt-sm">
              <q-img :src="file_path + form.file_name" style="max-width: 150px; border-radius: 6px;" />
              <div class="text-caption text-grey">File lama</div>
            </div>
            <hr class="hrpagin2">

          </q-card-section>

          <q-card-actions class="bg-grey-4 mdl-footer" align="right">
            <q-btn :loading="btn_edit" color="primary" type="submit" label="Update" />
            <q-btn label="Batal" color="negative" v-close-popup />
          </q-card-actions>

        </form>
      </q-card>
    </q-dialog>
    <!-- ===================== MODAL EDIT BERITA ===================== -->

    <q-dialog v-model="mdl_lihat" persistent>
      <q-card class="mdl-lg q-pa-none" style="max-width: 900px; border-radius: 16px; overflow: hidden;">
        <q-card-section class="main2 text-white">
          <div class="text-h6 h_modalhead">lihat Berita</div>
        </q-card-section>



        <!-- Konten Scrollable -->
        <q-card-section class="q-pa-lg scroll" style="max-height: 70vh; overflow-y: auto;">
          <!-- Judul -->
          <div class="text-h5 text-primary text-bold q-mb-md">{{ form.judul }}</div>

          <!-- Info Meta -->
          <div class="text-grey-7 q-mb-md" style="font-size: 14px;">
            <q-icon name="feed" size="16px" class="q-mr-xs" />
            <span class="q-mr-md">Sumber: <span class="text-blue">{{ form.sumber }}</span></span>
            <q-icon name="event" size="16px" class="q-mr-xs" />
            <span>{{ UMUM.tglConvert(form.createAt) }}</span>
          </div>

          <!-- Deskripsi -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-bold">Deskripsi Singkat</div>
            <div class="text-body2 text-grey-8">{{ form.deskripsi }}</div>
          </div>

          <!-- Isi -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-bold">Isi Berita</div>
            <div class="text-body1 q-mt-sm" v-html="form.isi"></div>
          </div>
        </q-card-section>

        <!-- Footer -->
        <q-separator />
        <q-card-actions class="bg-grey-4 mdl-footer" align="right">
          <q-btn label="Tutup" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>




    <!-- ================================================ MODAL HAPUS ================================================ -->
    <q-dialog v-model="mdl_delete" persistent>
      <q-card class="mdl-sm ">
        <q-card-section class="q-pt-none text-center orageGrad">
          <form @submit.prevent="removeData">
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

    <!-- ================================================ MODAL IMG ================================================ -->

    <q-dialog v-model="mdl_image">
      <q-card class="bg-purple mdl-lg">
        <q-card-section class="text-center">
          <q-img :src="selectedImage" style="max-width: 90vw; max-height: 90vh; border-radius: 10px;" fit="contain" />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Tutup" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ================================================ MODAL IMG ================================================ -->


  </div>
</template>


<script>


import UMUM from "../library/umum.js";
export default {
  data() {
    return {

      list_data: [],
      editorToolbar: [
        ['bold', 'italic', 'underline'],
        ['link', 'quote', 'unordered', 'ordered'],
        ['left', 'center', 'right', 'justify'], // ✅ rata teks
        ['image'], // ✅ upload / insert gambar
        ['viewsource']
      ],
      form: {
        isi: '',    // ✅ ini sudah ada
        judul: '',
        sumber: '',
        deskripsi: '',
        file_name: null
      },
      fileBaru: null, // ini khusus untuk q-file (File object)

      UMUM: UMUM,
      btn_add: false,
      btn_edit: false,

      mdl_add: false,
      mdl_edit: false,
      mdl_delete: false,
      mdl_lihat: false,
      mdl_image: false,
      selectedImage: null,

      alert: false,


      cari_value: "",
      page_first: 1,
      page_last: 1,
      page_limit: 9,
      total: 0,


      tipe: null, // simpan tipe user


      file_path: this.$store.state.url.URL_APP + "uploads/",


    }


  },


  methods: {

    openEdit(data) {
      this.form = { ...data, isi: data.isi || '' }
      this.mdl_edit = true
    },
    openDelete(data) {
      this.form = { id: data.id }
      this.mdl_delete = true
    },

    openLihat(data) {
      this.form = { ...data, isi: data.isi || '' }
      this.mdl_lihat = true
    },

    openImage(src) {
      this.selectedImage = src
      this.mdl_image = true
    },




    formatRupiah(value) {
      if (value == null) return "-";
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },


    resetForm() {
      this.form = {
        judul: '',
        sumber: '',
        deskripsi: '',
        isi: '',
        file_name: null
      }
    },

    // ambil data utama
    getView() {
      this.$store.commit("shoWLoading");

      fetch(this.$store.state.url.BERITA + "getview", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({
          data_ke: this.page_first,
          cari_value: this.cari_value,
          page_limit: this.page_limit
        })
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_data = res_data.data;
          this.total = res_data.total;
          this.page_last = Math.ceil(this.total / this.page_limit);
          this.$store.commit("hideLoading");
        })
        .catch(err => {
          console.error("❌ Error getView:", err);
          this.$store.commit("hideLoading");
        });
    },

    addData() {
      this.btn_add = true;
      const formData = new FormData();

      formData.append("judul", this.form.judul);
      formData.append("sumber", this.form.sumber);
      formData.append("deskripsi", this.form.deskripsi);
      formData.append("isi", this.form.isi);
      if (this.form.file_name) {
        formData.append("file_name", this.form.file_name); // harus sama dengan upload.single("file_name")
      }

      fetch(this.$store.state.url.BERITA + "addData", {
        method: "POST",
        headers: {
          authorization: "kikensbatara " + localStorage.token
        },
        body: formData
      })
        .then(res => res.json())
        .then(res_data => {
          this.btn_add = false;
          if (res_data.success) {
            this.Notify("Sukses Menambah Data", "primary", "check_circle_outline");
            this.getView();
            this.mdl_add = false;
            this.resetForm();
          } else {
            this.Notify(res_data.message || "Gagal Menambah Data", "negative", "error_outline");
          }
        })
        .catch(err => {
          this.btn_add = false;
          console.error("❌ Error:", err);
          this.Notify("Terjadi kesalahan server", "negative", "error_outline");
        });
    },

    async updateData() {
      try {
        const formData = new FormData()
        formData.append("id", this.form.id)
        formData.append("judul", this.form.judul)
        formData.append("sumber", this.form.sumber)
        formData.append("deskripsi", this.form.deskripsi)
        formData.append("isi", this.form.isi)

        // kalau user upload file baru → kirim file
        if (this.fileBaru) {
          formData.append("file", this.fileBaru)
        } else {
          // kalau tidak upload file baru → tetap kirim nama file lama
          formData.append("file_name", this.form.file_name)
        }

        const res = await fetch(this.$store.state.url.BERITA + "updateData", {
          method: "POST",
          headers: {
            authorization: "kikensbatara " + localStorage.token
          },
          body: formData
        })

        const result = await res.json()
        if (result.success) {
          this.$q.notify({ type: "positive", message: result.message })
          this.mdl_edit = false
          this.getView()
        } else {
          this.$q.notify({ type: "negative", message: result.message })
        }
      } catch (err) {
        console.error("❌ Error updateData:", err)
        this.$q.notify({ type: "negative", message: "Gagal update data" })
      }
    },

    removeData() {
      fetch(this.$store.state.url.BERITA + "removeData", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ id: this.form.id })
      })
        .then(res => res.json())
        .then(res_data => {
          if (res_data.success) {
            this.Notify(res_data.message || '✅ Sukses Menghapus Data', 'negative', 'check_circle_outline')
            this.getView()
          } else {
            this.Notify(res_data.message || '⚠️ Data tidak ditemukan', 'warning', 'error')
          }
        })
        .catch(err => {
          this.Notify('❌ Error: ' + err.message, 'warning', 'error')
        })
    },


    simulateProgress(number) {
      // we set loading state
      this[`simpan${number}`] = true
      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        this[`simpan${number}`] = false
      }, 3000)
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


    btn_prev() {
      if (this.page_first > 1) this.page_first--;
      this.getView();
    },

    btn_next() {
      if (this.page_first < this.page_last) this.page_first++;
      this.getView();
    },

    cari_data() {
      this.page_first = 1;
      this.getView();
    },

    indexing(index) {
      return ((this.page_first - 1) * this.page_limit) + index;
    },


  },
  mounted() {

    const get_profile = JSON.parse(localStorage.profile);
    this.tipe = Number(get_profile.profile.db_csrkonsel); // ambil db_csrkonsel

    this.getView();

  }
}
</script>
