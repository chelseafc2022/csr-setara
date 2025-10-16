<template>
  <div>
    <!-- breadcrumb-area -->
    <section class="breadcrumb__area breadcrumb__bg">
      <div class="bg-img position-absolute top-0 bottom-0 start-0 w-100 h-100"
        data-background="/assets/img/bg/breadcrumb_bg.jpg"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb__content">
              <h2 class="title text-center" style="font-size: 25pt;">{{ $route.name }}</h2>
              <h2 class="title text-center" style="font-size: 25pt;">Corporate Social Responsibility (CSR)
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="breadcrumb__shape">
        <img src="/assets/img/images/breadcrumb_shape01.png" alt="Apexa" class="dark-opacity" />
        <img src="/assets/img/images/breadcrumb_shape02.png" alt="Apexa" class="rightToLeft dark-opacity" />
        <img src="/assets/img/images/breadcrumb_shape03.png" alt="Apexa" class="dark-opacity" />
        <img src="/assets/img/images/breadcrumb_shape04.png" alt="Apexa" class="dark-opacity" />
        <img src="/assets/img/images/breadcrumb_shape05.png" alt="Apexa" class="alltuchtopdown dark-opacity" />
      </div>
    </section>
    <!-- breadcrumb-area-end -->
    <!-- blog-area -->
    <section class="contact__area">
      <div class="container">
        <form @submit.prevent="submitForm">

          <div class="row g-4 contact__form-wrap">



            <!-- FORM PENANGGUNG JAWAB -->
            <div class="col-lg-6">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h4 class="mb-3">👤 Penanggung Jawab</h4>

                  <div class="mb-3">
                    <label class="form-label">Nama Lengkap *</label>
                    <input type="text" class="form-control" v-model="form.nama" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Jabatan</label>
                    <input type="text" class="form-control" v-model="form.jabatan" required>
                  </div>

                  <!-- <div class="mb-3">
                    <label class="form-label">Username *</label>
                    <input type="text" class="form-control" v-model="form.username" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Password *</label>
                    <input type="password" class="form-control" v-model="form.password" required>
                  </div> -->

                  <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" v-model="form.pic_email" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">No. HP *</label>
                    <input type="text" class="form-control" v-model="form.pic_hp" required>
                  </div>
                </div>
              </div>
            </div>

            <!-- FORM PERUSAHAAN -->
            <div class="col-lg-6">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h4 class="mb-3">🏢 Data Perusahaan</h4>

                  <div class="mb-3">
                    <label class="form-label">Nama Perusahaan *</label>
                    <input type="text" class="form-control" v-model="form.perusahaan_nama" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Bidang Usaha *</label>
                    <select class="form-select" v-model="form.bidang_usaha_id" required>
                      <option value="">-- Pilih Bidang Usaha --</option>
                      <option v-for="bidang in list_bidang_usaha" :key="bidang.id" :value="bidang.id">
                        {{ bidang.uraian }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" v-model="form.perusahaan_email" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Telepon *</label>
                    <input type="text" class="form-control" v-model="form.perusahaan_hp" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Alamat *</label>
                    <textarea class="form-control" rows="3" v-model="form.alamat" required></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">
                      Upload Dokumen (Wajib, sesuai syarat admin)*
                    </label>
                    <input type="file" class="form-control" accept="application/pdf" @change="handleFileUpload"
                      required>
                  </div>
                </div>
              </div>
            </div>

            <!-- TOMBOL SUBMIT -->
            <div class="col-12 text-center mt-4">
              <button type="submit" class="btn">
                🚀 Kirim Permohonan
              </button>
            </div>


          </div>
        </form>

      </div>
    </section>
    <!-- blog-area-end -->

  </div>
</template>

<script>

export default {
  data() {
    return {


      list_bidang_usaha: [], // ambil dari master_bidang_usaha
      form: {
        perusahaan_nama: "",
        bidang_usaha_id: "",
        perusahaan_email: "",
        perusahaan_hp: "",
        alamat: "",


        // tambahan untuk PIC
        nama: "",
        jabatan: "",
        file_name: null  // Untuk menyimpan file dokumen
      },



    }
  },
  methods: {

    getBidangUsaha() {
      fetch(this.$store.state.URL.publish_bidang_usaha + "view", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          data_ke: 1,
          page_limit: 100,
          cari_value: ""
        })
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_bidang_usaha = res_data.data
        })
    },

    async submitForm() {
      try {
        const konfirmasi = confirm("Apakah data yang Anda isi sudah benar?");
        if (!konfirmasi) return;

        const formData = new FormData();  // Gunakan FormData untuk mengirim file
        formData.append('perusahaan_nama', this.form.perusahaan_nama);
        formData.append('bidang_usaha_id', this.form.bidang_usaha_id);
        formData.append('perusahaan_email', this.form.perusahaan_email);
        formData.append('perusahaan_hp', this.form.perusahaan_hp);
        formData.append('alamat', this.form.alamat);
        formData.append('nama', this.form.nama);  // PIC
        formData.append('jabatan', this.form.jabatan);  // PIC
        formData.append('pic_email', this.form.pic_email);  // PIC
        formData.append('pic_hp', this.form.pic_hp);  // PIC
        formData.append('dokumen', this.form.file_name);  // Tambahkan file dokumen

        const res = await fetch(this.$store.state.URL.registrasiMitra, {
          method: "POST",
          body: formData  // Kirim FormData, bukan JSON.stringify
        });

        const data = await res.json();

        if (data.success) {
          alert("Permohonan berhasil dikirim! Admin akan memverifikasi dokumen Anda. Jika diterima, Silahkan Cek Email Anda Untuk Mendapatkan Akun 🎉");
          // Redirect atau tampilkan pesan selanjutnya
        } else {
          alert("Gagal: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi error server");
      }
    },

    handleFileUpload(event) {
      this.form.file_name = event.target.files[0];  // Simpan file yang dipilih
    },




  },
  mounted() {
    this.getBidangUsaha();
  },
}
</script>

<style scoped>
.btn::after {
  content: none;
}
</style>