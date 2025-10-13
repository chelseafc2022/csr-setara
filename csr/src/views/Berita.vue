<template>
    <div>
        <!-- breadcrumb-area -->
        <section class="breadcrumb__area breadcrumb__bg">
            <div class="bg-img position-absolute top-0 bottom-0 start-0 w-100 h-100"
                data-background="/assets/img/bg/breadcrumb_bg.jpg"></div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="breadcrumb__content">
                            <h2 class="title">{{ $route.name }}</h2>
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
        <section class="">
            <div class="container">
                <div class="blog__inner-wrap">
                    <div class="row">

                        <div class="col-md-70 mb-50">

                        </div>

                        <div class="col-70">
                            <div class="blog-post-wrap">
                                <div class="row gutter-24">
                                    <div class="col-md-6" v-for="data in list_berita" :key="data.id">
                                        <div class="blog-post-item blog__post-three shine-animate-item">
                                            <div class="blog-post-thumb blog__post-thumb-three">
                                                <a @click="pushKe(data.id)" href="javascript:void(0);"
                                                    :title="data.judul" class="shine-animate"><img
                                                        :src="file_path + data.file_name" alt="Apexa" /></a>
                                            </div>
                                            <div class="blog-post-content blog__post-content-three">
                                                <!-- <a href="javascript:void(0);" class="post-tag">{{data.kategori_id}}</a> -->
                                                <h2 class="title">
                                                    <a @click="pushKe(data.id)" href="javascript:void(0);"
                                                        :title="data.judul"><span>{{ truncateText(data.judul, 80)
                                                            }}</span></a>
                                                </h2>


                                                <!-- <div class="blog-post-meta mb-20">
                                                        <ul class="list-wrap">
                                                            <li><i class="fas fa-calendar-alt"></i>{{convert_tgl(data.createAt)}}</li>
                                                            
                                                        </ul>
                                                    </div> -->

                                                <div class="blog-post-meta">
                                                    <div class="blog-avatar">
                                                        <div class="avatar-content">
                                                            <p>By <a href="javascript:void(0)">{{
                                data.createBy?.toLowerCase?.() || 'Admin' }}</a>
                                                                &nbsp;
                                                                <i class="fas fa-calendar-alt"></i>
                                                                {{ UMUM.tglConvert(data.createAt).tgl }}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </div>
                                                <!-- <a @click="push_berita(data.id)" href="javascript:void(0);" :title="data.judul"  class="btn">Baca Selengkapnya</a> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pagination-wrap mt-40 mb-40">
                                    <nav aria-label="Page navigation example">
                                        <ul class="pagination list-wrap">
                                            <li class="page-item">
                                                <a class="page-link paginasia" @click="prevPage"
                                                    :disabled="currentPage === 1">
                                                    <i class="fas fa-angle-double-left"></i>
                                                </a>
                                            </li>

                                            <li v-for="page in visiblePages" :key="page" class="page-item"
                                                :class="{ active: page === currentPage, disabled: page === '...' }">
                                                <a v-if="page !== '...'" class="page-link paginasia"
                                                    @click="goToPage(page)">{{ page }}</a>
                                                <span v-else class="page-link paginasia">...</span>
                                            </li>

                                            <li class="page-item">
                                                <a class="page-link paginasia" @click="nextPage"
                                                    :disabled="currentPage === totalPages">
                                                    <i class="fas fa-angle-double-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        <!-- ===== SIDEBAR ======== -->
                        <div class="col-30">
                            <aside class="blog__sidebar">
                                <div class="sidebar__widget sidebar__widget-two">
                                    <div class="sidebar__search">
                                        <form action="#">
                                            <input type="text" placeholder="Cari Berita . . ." name="search"
                                                id="wid-search" value="" v-model="cari_value" @keyup="cari_data()">
                                            <button type="submit">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                                    <path
                                                        d="M19.0002 19.0002L14.6572 14.6572M14.6572 14.6572C15.4001 13.9143 15.9894 13.0324 16.3914 12.0618C16.7935 11.0911 17.0004 10.0508 17.0004 9.00021C17.0004 7.9496 16.7935 6.90929 16.3914 5.93866C15.9894 4.96803 15.4001 4.08609 14.6572 3.34321C13.9143 2.60032 13.0324 2.01103 12.0618 1.60898C11.0911 1.20693 10.0508 1 9.00021 1C7.9496 1 6.90929 1.20693 5.93866 1.60898C4.96803 2.01103 4.08609 2.60032 3.34321 3.34321C1.84288 4.84354 1 6.87842 1 9.00021C1 11.122 1.84288 13.1569 3.34321 14.6572C4.84354 16.1575 6.87842 17.0004 9.00021 17.0004C11.122 17.0004 13.1569 16.1575 14.6572 14.6572Z"
                                                        stroke="currentcolor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>

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
                                                        class="flaticon-time"></i>{{ UMUM.tglConvert(data.createAt).tgl}}</span>
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
        </section>
        <!-- blog-area-end -->

    </div>
</template>

<script>

import { useStore } from "vuex";

import UMUM from '../library/umum';
export default {
    data() {
        const store = useStore();
        return {
            file_path: store.state.UPLOADS,
            UMUM: UMUM,
            list_berita: [],
            list_berita_side: [],

            page_limit: 6,
            total: 0,
            cari_value: "",
            currentPage: 1,
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.total / this.page_limit);
        },
        visiblePages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPage;

            if (total <= 7) {
                // Kalau total halaman sedikit, tampilkan semua
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                // Selalu tampilkan halaman pertama
                pages.push(1);

                if (current > 4) {
                    pages.push("..."); // ellipsis sebelum current
                }

                // Tampilkan halaman di sekitar current (misalnya ±2)
                let start = Math.max(2, current - 2);
                let end = Math.min(total - 1, current + 2);

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (current < total - 3) {
                    pages.push("..."); // ellipsis setelah current
                }

                // Selalu tampilkan halaman terakhir
                pages.push(total);
            }

            return pages;
        }
    },
    methods: {

        getListBerita() {
            fetch(this.$store.state.URL.BERITA_CSR + "getview", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    data_ke: this.currentPage,
                    page_limit: this.page_limit,
                    cari_value: this.cari_value
                })
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.list_berita = res_data.data;
                        this.total = res_data.total;
                    }
                })
                .catch(err => {
                    console.error("❌ Fetch error:", err);
                });
        },

        getListBeritaSide: function () {
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
        // pindah halaman
        changePage(page) {
            this.data_ke = page;
            this.getListBerita();
        },

        cari_data() {
            this.currentPage = 1; // reset ke halaman pertama
            this.getListBerita();
        },


        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.getListBerita();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.getListBerita();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getListBerita();
            }
        },
        routerKe(data) {
            this.$router.push(data)
        },
        truncateText(text, length) {
            if (!text) return "";
            return text.length > length ? text.substring(0, length) + "..." : text;
        },

        pushKe(id) {
            this.$router.push(`/Beritaisi/${id}`);
        },

    },
    mounted() {
        this.getListBerita();
        this.getListBeritaSide();
    },
}
</script>

<style scoped>
.paginasia {
    font-size: 8pt !important;
    height: 35px !important;
    width: 35px !important;
}
</style>