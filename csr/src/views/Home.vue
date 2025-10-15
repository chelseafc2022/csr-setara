<template>
  <div class="home">
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div class="carousel-slide">
          <div :style="{ backgroundColor: backgroundColor }">
            <img src="../../public/img/foto1.png" alt="Image" />
          </div>
        </div>
      </div>

      <div class="controls">
        <button @click="prev">‹</button>
        <button @click="next">›</button>
      </div>
    </div>

    <section class="services__area-two" style="background-color: #ffffff !important;">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="section-title white-title mb-50 tg-heading-subheading animation-style3">
              <h2 class="title tg-element-title text-center" style="color: #171a7c;">BIDANG KEGIATAN CSR
                <span class="sub-title">Alur Perusahaan Berpartisipasi Mengerjakan Paket-Paket Kegiatan CSR Yang
                  Tersedia</span>
              </h2>
            </div>
          </div>
        </div>


        <!-- <div class="row row-cols-5 g-3 justify-content-center"> -->
          <div class="row row-cols-3 row-cols-md-5 g-3 justify-content-center">
          <!-- BIDANG 1 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1of8melwynqs' } })">
                <img src="assets/img/logo/app/1.png" alt="Pendidikan & Olahraga" />
              </a>
            </div>
          </div>

          <!-- BIDANG 2 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1of8melwyvil' } })">
                <img src="assets/img/logo/app/2.png" alt="Kesehatan" data-aos="fade-in" data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 3 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1of8melwz5qo' } })">
                <img src="assets/img/logo/app/3.png" alt="Seni, Budaya dan Pariwisata" data-aos="fade-in"
                  data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 4 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9wpyks' } })">
                <img src="assets/img/logo/app/4.png" alt="Kesejahteraan Sosial" data-aos="fade-in"
                  data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 5 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9wqae5' } })">
                <img src="assets/img/logo/app/5.png" alt="Usaha Ekonomi Kerakyatan" data-aos="fade-in"
                  data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- Baris 2 -->
          <!-- BIDANG 6 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9wqd9v' } })">
                <img src="assets/img/logo/app/6.png" alt="Keagamaan" data-aos="fade-in" data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 7 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#" @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '1' } })">
                <img src="assets/img/logo/app/7.png" alt="Perlindungan dan Pengelolaan Lingkungan Hidup"
                  data-aos="fade-in" data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 8 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9wrlgl' } })">
                <img src="assets/img/logo/app/9.png" alt="Pertanian dan Pertenakan" data-aos="fade-in"
                  data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 9 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9wrw9f' } })">
                <img src="assets/img/logo/app/10.png" alt="Infrastruktur" data-aos="fade-in" data-aos-delay="400" />
              </a>
            </div>
          </div>

          <!-- BIDANG 10 -->
          <div class="col mt-5">
            <div class="shadow">
              <a href="#"
                @click.prevent="$router.push({ path: '/Kegiatancsr', query: { bidang: '4ovm1r0fmf9ws09b' } })">
                <img src="assets/img/logo/app/11.png" alt="Lain-lain" data-aos="fade-in" data-aos-delay="400" />
              </a>
            </div>
          </div>
        </div>

      </div>
      <div class="services__shape-wrap">
        <img src="assets/img/images/h2_services_shape01.png" alt="Apexa" data-aos="fade-right" data-aos-delay="400" />
        <img src="assets/img/images/h2_services_shape02.png" alt="Apexa" data-aos="fade-left" data-aos-delay="400" />
      </div>
    </section>
    <!-- services-area-end -->

    <section class="services__area-two">
      <div class="container">
        <!-- Section Title -->
        <div class="row">
          <div class="col-lg-12">
            <div class="section-title white-title mb-50 tg-heading-subheading animation-style3 text-center">
              <h2 class="title tg-element-title">KEGIATAN CSR KAB. KONAWE SELATAN</h2>
              <span class="sub-title">Perusahaan Dapat Berpartisipasi Mengerjakan Paket-Paket Kegiatan CSR Yang
                Tersedia</span>
            </div>
          </div>
        </div>

        <!-- CSR Cards -->
        <div class="row justify-content-center gutter-24 position-relative">
          <div v-if="isLoading" class="loading-overlay">
              <div class="spinner"></div>
          </div>
          <div v-else class="col-xl-4 col-lg-4 col-md-6 mb-4" v-for="(csr, index) in listCSR" :key="index">
            <div class="blog__post-two shine-animate-item">
              <div class="blog__post-thumb-two">
                <a @click="routerKe(csr.id)" href="javascript:void(0)" class="shine-animate">
                  <img :src="getImage(csr)" alt="CSR Image" />
                </a>
              </div>
              <div class="blog__post-content-two">
                <!-- Judul + bidang -->
                <a @click="routerKe(csr.id)" href="javascript:void(0)">
                  <p style="font-size: 10pt !important; text-align: justify !important;">{{ csr.nama_csr }}</p>
                </a>

                <div>
                  <p style="font-size: 10pt !important;"> <span class="opacity-50"><b>{{ csr.uraian_bidang_csr
                        }}</b></span> | <span v-if="csr.uraian_bidang_sub_csr" class="opacity-25">{{
            csr.uraian_bidang_sub_csr }}</span> </p>
                  <!-- <p style="font-size: 10pt !important;"></p> -->
                </div>

                <!-- Nilai dan jumlah -->
                <p style="font-size: 10pt !important; margin-top: 4px;">
                  <span class="opacity-55">{{ csr.jumlah }} {{ csr.satuan }}</span> |
                  <span class="opacity-100"><b>{{ formatRupiah(csr.nilai) }} / {{ csr.satuan }}</b></span> -
                  <span v-if="csr.status === 1" class="badge text-bg-warning">Program CSR Baru</span>
                  <span v-else-if="csr.status === 2" class="badge text-bg-primary">Dalam Pengerjaan</span>
                  <span v-else-if="csr.status === 3" class="badge text-bg-secondary">Pengerjaan Sebagian</span>
                  <span v-else-if="csr.status === 4" class="badge text-bg-success">Selesai</span>
                </p>

                <!-- Status badge -->
                <!-- <div class="blog-avatar" style="margin-top: 6px;">
    <div class="avatar-content">
      <span style="font-size: 10pt;">
        <span v-if="csr.status === 1" class="badge text-bg-warning">Program CSR Baru</span>
        <span v-else-if="csr.status === 2" class="badge text-bg-primary">Dalam Pengerjaan</span>
        <span v-else-if="csr.status === 3" class="badge text-bg-secondary">Pengerjaan Sebagian</span>
        <span v-else-if="csr.status === 4" class="badge text-bg-success">Selesai</span>
      </span>
    </div>
  </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="services-bottom-content">
          <router-link to="/Kegiatancsr" class="btn">Kegiatan Lainnya</router-link>

        </div>
      </div>

      <!-- Decorative Shapes -->
      <div class="services__shape-wrap">
        <img src="assets/img/images/h2_services_shape01.png" alt="Apexa" data-aos="fade-right" data-aos-delay="400" />
        <img src="assets/img/images/h2_services_shape02.png" alt="Apexa" data-aos="fade-left" data-aos-delay="400" />
      </div>
    </section>
    <!-- blog-post-area -->
    <section class="blog__post-area-five marketing__area-home12">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-6">
            <div class="section-title text-center mb-50 tg-heading-subheading animation-style3">
              <!-- <span class="sub-title">Berita Terbaru</span> -->
              <h5 class="title tg-element-title">Berita Terbaru CSR</h5>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-xl-4 col-lg-6 col-md-10" v-for="data in list_berita" :key="data.id">
            <div class="blog-post-item blog__post-three shine-animate-item">
              <div class="blog-post-thumb blog__post-thumb-three">
                <a @click="pushKe(data.id)" href="javascript:void(0);" :title="data.judul" class="shine-animate"><img
                    :src="file_path + data.file_name" alt="Apexa" /></a>
              </div>
              <div class="blog-post-content blog__post-content-three">
                <!-- <a href="javascript:void(0);" class="post-tag">{{data.kategori_id}}</a> -->
                <h2 class="title">
                  <a @click="pushKe(data.id)" href="javascript:void(0);" :title="data.judul"><span>{{
            truncateText(data.judul, 80) }}</span></a>
                </h2>
                <div class="blog-post-meta mb-20">
                  <ul class="list-wrap">
                    <li><i class="fas fa-calendar-alt"></i>{{ UMUM.tglConvert(data.createAt).tgl }}</li>
                  </ul>
                </div>
                <a @click="pushKe(data.id)" href="javascript:void(0);" :title="data.judul" class="btn">Baca
                  Selengkapnya</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="blog-shape-wrap">
        <img src="assets/img/images/h5_blog_shape01.png" alt="Apexa" data-aos="fade-right" data-aos-delay="400" />
        <img src="assets/img/images/h5_blog_shape02.png" alt="Apexa" data-aos="fade-left" data-aos-delay="400" />
      </div>

      <div class="project-content-bottom">
        <!-- <a href="javascript:void(0);" class="btn">Foto Lainnya</a> -->
        <router-link to="/BeritaOPD" class="btn">Berita Lainnya</router-link>
      </div>
    </section>
    <!-- blog-post-area-end -->
    <!-- choose-area -->
    <!-- <section class="choose__area-two">
            <div class="choose__bg" data-background="assets/img/bg/choose_bg.jpg"></div>
            <div class="container">
                <div class="row justify-content-end">
                    <div class="col-lg-8 col-md-10">
                        <div class="choose__content-two">
                            <div class="section-title mb-20 tg-heading-subheading animation-style3">
            
                                <h2 class="title tg-element-title">Link Terkait</h2>
                            </div>
                            <p style="text-align: justify;">Untuk memperluas pemahaman dan memberikan informasi tambahan
                                kepada pembaca, halaman ini menyediakan beberapa link terkait yang relevan dengan topik
                                yang dibahas. Link-link tersebut dapat mengarahkan Anda ke sumber referensi, artikel
                                pendukung, atau halaman lain yang memiliki keterkaitan informasi, sehingga pembaca dapat
                                menggali lebih dalam sesuai kebutuhan. Dengan adanya link terkait, diharapkan pengalaman
                                membaca menjadi lebih kaya dan menyeluruh.</p>
                            <div class="row">
                                <div class="col-lg-4 col-md-6 gy-4" v-for="data in listLink" :key="data.id">
                                    <div class="choose__box-two image-container">
                                        <a :href="data.url">
                                            <img :src="$store.state.UPLOADS+data.file"
                                                alt="gambar" class="responsive-img" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div class="operating__box">
                                <div class="icon">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <div class="content">
                                    <p>
                                        Link Terkait - <br />

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
 
        </section> -->
    <!-- choose-area-two -->
  </div>
</template>



<script>
import UMUM from '../library/umum.js';
import { useStore } from "vuex";


export default {
  data() {
    const store = useStore();

    return {

      listCSR: [],
      list_berita: [],
      file_path: store.state.UPLOADS,




      UMUM: UMUM,

      isVisible: false,
      //   mobileMenu:"",
      currentIndex: 0,
      images: [
        "https://server-web.konaweselatankab.go.id/uploads/1740462547777.png",
        "https://picsum.photos/id/1016/800/450",
        "https://picsum.photos/id/1018/800/450"
      ],
      intervalId: null,
      backgroundColor: "#FFFFFF",
      imageRef: null,
      listSlider: [],
      listBerita: [],
      listLink: [],
      list_tentang: [],

      isLoading: false,

      unit_kerja: "PYRiCmEdcQZdYxrhe",

    }
  },
  methods: {

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prev() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    startAutoplay() {
      this.intervalId = setInterval(() => {
        this.next();
      }, 6000); // Ganti gambar tiap 3 detik
    },
    stopAutoplay() {
      clearInterval(this.intervalId);
    },
    setImageRef(el) {
      this.imageRef = el;
    },
    onImageLoad() {
      if (!this.imageRef) return;

      try {
        const color = this.getDominantColor(this.imageRef);
        this.backgroundColor = color;
      } catch (e) {
        console.warn("Gagal ambil warna:", e);
      }
    },
    getDominantColor(imgEl) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imgEl.naturalWidth;
      canvas.height = imgEl.naturalHeight;
      ctx.drawImage(imgEl, 0, 0);

      const { data } = ctx.getImageData(0, 0, 1, 1); // ambil piksel atas kiri
      const [r, g, b] = data;
      return `rgb(${r}, ${g}, ${b})`;
    },

    linkto(linknya) {
      this.$router.push({ path: linknya })
    },


    getListBerita: function () {
      this.cek_load_data_list = true;
      fetch(this.$store.state.URL.HOME + "beritaHome", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        }
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_berita = res_data; // langsung array
          this.cek_load_data_list = false;
        })
        .catch(err => {
          console.error("❌ Error getListBerita:", err);
          this.cek_load_data_list = false;
        });
    },



    async fetchCSR() {
      this.isLoading = true; 
      try {
        const res = await fetch(this.$store.state.URL.HOME + "homeCSRview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            page_limit: 6,
            data_ke: 1,
            order_by: "tanggal_upload",
            order_dir: "desc"
          })
        });
        const data = await res.json();
        this.listCSR = data.data || [];
      } catch (err) {
        console.error("Error fetching CSR:", err);
      } finally {
        this.isLoading = false; // stop loading
      }
    },
    routerKe(id) {
      this.$router.push(`/Kegiatancsrisi/${id}`);
    },
    pushKe(id) {
      this.$router.push(`/Beritaisi/${id}`);
    },
    getImage(csr) {
      // Base URL untuk folder uploads CSR
      const baseURL = this.$store.state.UPLOADS; // atau bisa pakai URL.KEGIATAN_CSR+'uploads/' jika uploads ada di sana
      if (csr.file_name) return baseURL + csr.file_name;
      return baseURL + "default-csr.jpg"; // fallback jika tidak ada gambar
    },
    formatRupiah(value) {
      if (!value) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    truncateText(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },


  },
  mounted() {
    this.fetchCSR();
    this.getListBerita();
    // this.mobileMenu = this.$refs.desktopMenu.innerHTML;

    this.startAutoplay();



  },
  beforeUnmount() {
    this.stopAutoplay();

  }

}
</script>


<style scoped>
@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}




/* Container carousel */
.carousel-container {
  background-color: #ecf6fa !important;
  max-width: 100%;
  margin: auto;
  position: relative;
  overflow: hidden;
  border-radius: 0px;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
}

.carousel-wrapper {
  background-color: #ecf6fa !important;
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  max-width: 100%;
}

.ratio-box {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  /* 16:9 */
  background-color: #ecf6fa;
  overflow: hidden;
  margin: 0px 0px;
}

.ratio-box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Controls */
.controls {
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.controls button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.controls button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.text-boxx {
  /* width: 320px; */
  /* height: 4em; */
  /* overflow: hidden; */
  /* display: -webkit-box; */
  /* -webkit-line-clamp: 3; Jumlah baris maksimal */
  /* -webkit-box-orient: vertical; */
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 1em;
  font-size: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  display: -webkit-box;


  border-radius: 8px;



}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  border-radius: 10px;
  padding: 10px;
}

.responsive-img {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
  object-fit: contain;
}

/* Efek hover */
.image-container:hover .responsive-img {
  transform: scale(1.05);
}


.text-box {
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.text-box2 {
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px; /* optional, match your card layout */
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff; /* blue accent */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
