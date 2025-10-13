<template>
    <div>
        <section class="breadcrumb__area breadcrumb__bg ">
            <div class="bg-img position-absolute top-0 bottom-0 start-0 w-100 h-100 kantor-bg"></div>

            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="breadcrumb__content">
                            <h2 class="title">Detail Berita</h2>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html">Beranda</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Berita</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div class="breadcrumb__shape">
                <img src="assets/img/images/breadcrumb_shape01.png" alt="Apexa" class="dark-opacity" />
                <img src="assets/img/images/breadcrumb_shape02.png" alt="Apexa" class="rightToLeft dark-opacity" />
                <img src="assets/img/images/breadcrumb_shape03.png" alt="Apexa" class="dark-opacity" />
                <img src="assets/img/images/breadcrumb_shape04.png" alt="Apexa" class="dark-opacity" />
                <img src="assets/img/images/breadcrumb_shape05.png" alt="Apexa" class="alltuchtopdown dark-opacity" />
            </div>
        </section>


        <section class="blog__details-area">
            <div class="container">
                <div class="blog__inner-wrap">
                    <div class="row">
                        <div class="col-70">
                            <div class="blog__details-wrap">
                                <div class="blog__details-thumb">
                                    <img :src="file_path + form.file_name" alt="">
                                </div>
                                <div class="blog__details-content">
                                    <h2 class="title">{{ form.judul }}</h2>
                                    <div class="blog-post-meta">
                                        <ul class="list-wrap">
                                            <!-- <li><a href="blog.html" class="blog__post-tag-two">Business</a></li> -->
                                            <li>
                                                <div class="blog-avatar">
                                                    <!-- <div class="avatar-thumb">
                                                <img src="assets2/img/blog/blog_avatar01.png" alt="">
                                            </div> -->
                                                    <div class="avatar-content">
                                                        <p>By <a href="javascript:void(0)">{{ form.createdBy?.toLowerCase() || '-' }}</a></p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li><i class="fas fa-calendar-alt"></i>{{ UMUM.tglConvert(form.createAt).tgl }}</li>
                                            <!-- <li><i class="far fa-comment"></i><a href="blog-details.html">05 Comments</a></li> -->
                                        </ul>
                                    </div>
                                    <p v-html="form.isi"></p>
                                    <div class="blog__details-bottom">
                                        <div class="row align-items-center">
                                            <div class="col-md-8">
                                                <div class="post-tags">
                                                    <h5 class="title">Sumber:</h5>
                                                    {{ form.sumber }}

                                                    <!-- <ul class="list-wrap">
                                                  <li><a href="#">Finance</a></li>
                                                  <li><a href="#">Data</a></li>
                                                  <li><a href="#">Agency</a></li>
                                              </ul> -->
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="post-share">
                                                    <h5 class="title">Share:</h5>
                                                    <ul class="list-wrap">
                                                        <li><a :href="facebookLink" target="_blank"><i
                                                                    class="fab fa-facebook-f"></i></a></li>
                                                        <li> <a :href="whatsappLink" target="_blank"><i
                                                                    class="fab fa-whatsapp"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>





                        <!-- ===== SIDEBAR ======== -->
                        <div class="col-30">
                            <aside class="blog__sidebar">
                                <!-- <div class="sidebar__widget sidebar__widget-two">
                          <div class="sidebar__search">
                              <form action="#">
                                  <input type="text" placeholder="Cari Berita . . ." name="search" id="wid-search" value="" v-model="cari_value" @keyup="cari_data()">
                                  <button type="submit">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                          <path d="M19.0002 19.0002L14.6572 14.6572M14.6572 14.6572C15.4001 13.9143 15.9894 13.0324 16.3914 12.0618C16.7935 11.0911 17.0004 10.0508 17.0004 9.00021C17.0004 7.9496 16.7935 6.90929 16.3914 5.93866C15.9894 4.96803 15.4001 4.08609 14.6572 3.34321C13.9143 2.60032 13.0324 2.01103 12.0618 1.60898C11.0911 1.20693 10.0508 1 9.00021 1C7.9496 1 6.90929 1.20693 5.93866 1.60898C4.96803 2.01103 4.08609 2.60032 3.34321 3.34321C1.84288 4.84354 1 6.87842 1 9.00021C1 11.122 1.84288 13.1569 3.34321 14.6572C4.84354 16.1575 6.87842 17.0004 9.00021 17.0004C11.122 17.0004 13.1569 16.1575 14.6572 14.6572Z" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                  </button>
                              </form>
                          </div>
                      </div> -->

                                <div class="sidebar__widget">
                                    <h4 class="sidebar__widget-title">Berita Terbaru</h4>
                                    <div class="sidebar__post-list">

                                        <!-- @foreach($berita_sidebar as $data) -->
                                        <div class="sidebar__post-item" v-for="data in list_berita_side" :key="data.id">
                                            <div class="sidebar__post-thumb">
                                                <a class="shine-animate" @click="pushKe(data.id)"
                                                    :href="`#/isi_berita?id=${data.id}`" :title="data.judul"><img
                                                        :src="file_path + data.file_name" alt="" height="60px"
                                                        weight="50px"></a>
                                            </div>
                                            <div class="sidebar__post-content textbatas">
                                                <h5 class="title"><a class="shine-animate" @click="pushKe(data.id)"
                                                        href="javascript:void(0);" :title="data.judul">{{
                                                        truncateText(data.judul, 30) }}</a></h5>
                                                <span class="date"><i
                                                        class="flaticon-time"></i>{{convert_tgl(data.createAt)}}</span>
                                            </div>
                                        </div>
                                        <!-- @endforeach  -->


                                    </div>
                                </div>
                                <!-- <div class="sidebar__widget">
                          <h4 class="sidebar__widget-title">Pengumuman Terbaru</h4>
                          <div class="sidebar__brochure textbatas"  v-for="data in list_pengumuman_sidebar" :key="data.id">
                              <a @click="push_data_pengumuman(data.id)" href="javascript:void(0);" :title="data.judul" download ><i class="far fa-file-pdf"></i>{{data.judul}}</a>
                          </div>
                      </div> -->
                            </aside>
                        </div>

                        <!-- ==== END SIDEBAR === -->
                    </div>
                </div>
            </div>
            <!-- ======BG==== -->
            <div class="about__shape-wrap-four">
                <img src="assets/img/images/h4_about_shape01.png" alt="">
                <img src="assets/img/images/h4_about_shape02.png" alt="" data-parallax='{"x" : -80 , "y" : -80 }'>
            </div>
        </section>
        <!-- End Blog Post Section -->




    </div>
</template>



<script>

import { useStore } from "vuex";
import UMUM from '../library/umum';

export default {
    name: "web_pengumuman",
    //   title: "My page title",
    data: function () {
        const store = useStore();
        return {
            UMUM: UMUM,
            file_path: store.state.UPLOADS,
            id: "",



            form: {
                id: '',
                judul: '',
                sumber: '',
                deskripsi: '',
                isi: '',
                file_name: '',   // ganti foto → file_name (sesuai field di backend)
                createdBy: '',
                createAt: '',
            },
            

            //   list_pengumuman_sidebar: [],
            list_berita: [],
            list_berita_side: [],
        }
    },


    // =============================================================== METHODS =========================================================================
    methods: {

        getView() {
            fetch(this.$store.state.URL.BERITA_CSR + "detilBerita", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: this.id })
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.form = res_data.data   // isi form dengan hasil query backend
                    }
                })
                .catch(err => {
                    console.error("❌ Error getView:", err)
                })
        },

        truncateText(text, limit = 50) {
            if (!text) return '';
            return text.length > limit ? text.substring(0, limit) + '...' : text;
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
                    this.list_berita_side = res_data; // langsung array
                    this.cek_load_data_list = false;
                })
                .catch(err => {
                    console.error("❌ Error getListBerita:", err);
                    this.cek_load_data_list = false;
                });
        },

        // ================== PAGINASI ====================
        alertku: function (type, title) {
            this.$swal({
                type: type,
                title: title,
                showConfirmButton: false,
                timer: 800
            });
        },


        onFileSelected: function (event) {
            this.foto = event.target.files[0];
            console.log(this.foto);
        },
        convert_tgl: function (dateString) {
            var date = new Date(dateString);
            var getBulan = date.getMonth() + 1; var bulan = '';
            if (getBulan == '1') { bulan = 'Jan' }
            else if (getBulan == '2') { bulan = 'Feb' }
            else if (getBulan == '3') { bulan = 'Mar' }
            else if (getBulan == '4') { bulan = 'Apr' }
            else if (getBulan == '5') { bulan = 'Mei' }
            else if (getBulan == '6') { bulan = 'Jun' }
            else if (getBulan == '7') { bulan = 'Jul' }
            else if (getBulan == '8') { bulan = 'Agt' }
            else if (getBulan == '9') { bulan = 'Sep' }
            else if (getBulan == '10') { bulan = 'Okt' }
            else if (getBulan == '11') { bulan = 'Nov' }
            else if (getBulan == '12') { bulan = 'Des' }



            return date.getDate() + " " + bulan + " " + date.getFullYear();
        },

        pushKe(id) {
            this.$router.push(`/Beritaisi/${id}`);
        },

        // ================== PAGINASI ====================
    },
    // =============================================================== METHODS =========================================================================

    mounted() {
        this.id = this.$route.params.id || this.$route.query.id;
        if (!this.id) {
    console.error("❌ ID berita kosong!");
    return;
  }

  this.getView();
        this.getListBerita();
        //   this.getlistPengumuman();
        // this.getAsyncData();
        // alert(this.$route)
        // console.log('id = '+this.$route.query.id)
        // console.log(this.HOST);
    },


    computed: {
        shareUrl() {
            return encodeURIComponent(window.location.href)
        },
        encodedJudul() {
            return encodeURIComponent(this.form.judul)
        },
        facebookLink() {
            return `https://www.facebook.com/sharer.php?u=${this.shareUrl}&quote=${this.encodedJudul}`;
        },
        // twitterLink() {
        //   return `https://twitter.com/intent/tweet?text=${this.encodedJudul}&url=${this.shareUrl}`;
        // },
        whatsappLink() {
            return `https://wa.me/?text=${this.encodedJudul}%20${this.shareUrl}`;
        }
    },







};



</script>


<style>
.img_berita img {
    width: 100% !important;
    height: auto !important;
}
</style>