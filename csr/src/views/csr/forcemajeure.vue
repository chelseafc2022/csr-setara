<template>
    <div>
        <!-- breadcrumb-area -->
        <section class="breadcrumb__area breadcrumb__bg">
            <div class="bg-img position-absolute top-0 bottom-0 start-0 w-100 h-100"
                data-background="/assets/img/bg/breadcrumb_bg.jpg"></div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
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


                        <!-- Filter Section -->
                        <div class="col-md-6 mt-10">
                            <input v-model="filters.cari_value" class="form-control" @input="debouncedFetchCSR"
                                placeholder="Filter Nama CSR">
                        </div>

                        <div class="col-md-3 mt-10">
                            <select class="form-select" v-model="filters.bidang_force_id" @change="onBidangChange">
                                <option value="">Filter Bidang</option>
                                <option v-for="bidang in dropdownBidang" :key="bidang.id" :value="bidang.id">
                                    {{ bidang.uraian }}
                                </option>
                            </select>

                        </div>
                        <div class="col-md-3 mt-10">
                            <select class="form-select" v-model="filters.status" @change="fetchCSR(1)">
                                <option value="">Filter Status</option>
                                <option value="1">Program CSR Baru</option>
                                <option value="2">Dalam Pengerjaan</option>
                                <option value="3">Pengerjaan Sebagian</option>
                                <option value="4">Selesai</option>
                            </select>
                        </div>


                        <div class="col-md-6 mt-10">
                            <select class="form-select" v-model="filters.kecamatan_id" @change="onKecamatanChange">
                                <option value="">-- Filter Kecamatan --</option>
                                <option v-for="kec in dropdownKecamatan" :key="kec.kecamatan_id"
                                    :value="kec.kecamatan_id">
                                    {{ kec.nama_kecamatan }}
                                </option>
                            </select>


                        </div>

                        <div class="col-md-6 mt-10">
                            <select class="form-select" v-model="filters.desa_id" @change="fetchCSR(1)">
                                <option value="">Desa / Kelurahan</option>
                                <option v-for="desa in dropdownDesa" :key="desa.des_kel_id" :value="desa.des_kel_id">
                                    {{ desa.nama_des_kel }}
                                </option>
                            </select>
                        </div>

                        



                        <div class="mt-50">
                            <div class="blog-post-wrap">
                                <div class="row gutter-24">

                                    <div class="col-xl-4 col-lg-4 col-md-4" v-for="(csr, index) in listCSR"
                                        :key="index">

                                        <div class="blog__post-two shine-animate-item">
                                            <div class="blog__post-thumb-two">
                                                <a :href="getImage(csr)" class="shine-animate">
                                                    <img :src="getImage(csr)" alt="CSR Image" />
                                                </a>
                                            </div>
                                            <div class="blog__post-content-two">
                                                <!-- Judul + bidang -->
                                                <a @click="routerKe(csr.id)" href="javascript:void(0)">
                                                    <p
                                                        style="font-size: 10pt !important; text-align: justify !important;">
                                                        {{ csr.nama_csr }}</p>
                                                </a>

                                                <div>
                                                    <p style="font-size: 10pt !important;"> <span
                                                            class="opacity-50"><b>{{ csr.uraian_bidang_force
                                                                }}</b></span> 
                                                    </p>
                                                    <!-- <p style="font-size: 10pt !important;"></p> -->
                                                </div>

                                                <!-- Nilai dan jumlah -->
                                                <p style="font-size: 10pt !important; margin-top: 4px;">
                                                    <span class="opacity-55">{{ csr.jumlah }} {{ csr.satuan }}</span> |
                                                    <span class="opacity-100"><b>{{ formatRupiah(csr.nilai) }} /
                                                            {{ csr.satuan }}</b></span> -
                                                    <span v-if="csr.status === 1" class="badge text-bg-warning">Program
                                                        CSR Baru</span>
                                                    <span v-else-if="csr.status === 2"
                                                        class="badge text-bg-primary">Dalam Pengerjaan</span>
                                                    <span v-else-if="csr.status === 3"
                                                        class="badge text-bg-secondary">Pengerjaan Sebagian</span>
                                                    <span v-else-if="csr.status === 4"
                                                        class="badge text-bg-success">Selesai</span>
                                                </p>

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

                                            <li class="page-item" v-for="page in totalPages" :key="page"
                                                :class="{ active: page === currentPage }">
                                                <a class="page-link paginasia" @click="goToPage(page)">{{ page }}</a>
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



                    </div>
                </div>
            </div>
        </section>
        <!-- blog-area-end -->

    </div>
</template>

<script>
import _ from 'lodash'; // install lodash jika belum

import UMUM from '../../library/umum';
export default {
    data() {
        return {
            UMUM: UMUM,
            cari: "",
            bidang: "",
            currentPage: 1,
            pageLimit: 9,
            totalData: 0,
            totalPages: 0,
            listCSR: [],


            filters: {
                status: '',
                kecamatan_id: '',
                desa_id: '',
                bidang_force_id: '',
                cari_value: ''
            },
            dropdownKecamatan: [],
            dropdownDesa: [],
            dropdownBidang: [],

            status: [
                { id: 1, label: "Program CSR Baru" },
                { id: 2, label: "Dalam Pengerjaan" },
                { id: 3, label: "Pengerjaan Sebagian" },
                { id: 4, label: "Selesai" },
            ]



        }
    },
    methods: {

        debouncedFetchCSR: _.debounce(function () {
            this.fetchCSR(1);
        }, 100),

        onBidangChange() {
            this.fetchCSR(1);
        },

        onKecamatanChange() {
            // reset desa_id
            this.filters.desa_id = null;

            // ambil desa baru sesuai kecamatan
            this.fetchDesa(this.filters.kecamatan_id);

            // fetch CSR lagi
            this.fetchCSR(1);
        },

        async fetchCSR(page = 1) {
            try {
                const res = await fetch(this.$store.state.URL.KEGIATAN_FORCE + "forceMajeureView", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        page_limit: this.pageLimit,
                        data_ke: page,
                        order_by: "tanggal_upload",
                        order_dir: "desc",
                        ...this.filters
                    })
                });
                const data = await res.json();
                this.listCSR = data.data || [];
                this.totalData = data.total || 0;
                this.totalPages = Math.ceil(this.totalData / this.pageLimit);
                this.currentPage = page;
            } catch (err) {
                console.error("Error fetching CSR:", err);
            }
        },

        // Dropdown
        async fetchKecamatan() {
            try {
                const res = await fetch(this.$store.state.URL.KEGIATAN_FORCE + "kecamatan", { method: "POST", headers: { "Content-Type": "application/json" } });
                this.dropdownKecamatan = await res.json();
            } catch (err) { console.error(err); }
        },
        async fetchDesa(kecamatan_id) {
            if (!kecamatan_id) { this.dropdownDesa = []; return; }
            try {
                const res = await fetch(this.$store.state.URL.KEGIATAN_FORCE + "desa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ kecamatan_id })
                });
                this.dropdownDesa = await res.json();
            } catch (err) { console.error(err); }
        },
        async fetchBidang() {
            try {
                const res = await fetch(this.$store.state.URL.KEGIATAN_FORCE + "bidangForceMajeure");
                this.dropdownBidang = await res.json();
            } catch (err) { console.error(err); }
        },
       



        goToPage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.fetchCSR(page);
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.fetchCSR(this.currentPage + 1);
        },
        prevPage() {
            if (this.currentPage > 1) this.fetchCSR(this.currentPage - 1);
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
        routerKe(id) {
            this.$router.push(`/Kegiatancsrisi/${id}`);
        }


    },
    mounted() {
        this.fetchCSR();
        this.fetchKecamatan();
        // this.fetchDesa();
        this.fetchBidang();
        // this.fetchSubBidang();

        const bidangId = this.$route.query.bidang;
        if (bidangId) {
            this.filters.bidang_force_id = bidangId;
            this.fetchCSR(1);
        }

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