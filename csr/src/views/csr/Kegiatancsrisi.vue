<template>
    <div>

        <!-- blog-area -->
        <section class="mt-50 mb-40">
            <div class="container">
                <div class="blog__inner-wrap">
                    <div class="row">

                        <div class="col-md-12 col-sm-12 text-center">
                            <h6>KEGIATAN CORPORATE SOCIAL RESPONSIBILITY (CSR)</h6>
                            <hr style="border: 2px solid #0007cd;">
                        </div>

                        <div class="col-md-6 col-sm-12">
                            <div class="blog__details-thumb">
                                <h5 class="title">Informasi Program</h5>
                                <hr style="border: 2px solid #0007cd;">
                                <a :href="csrData ? getImage(csrData) : '/default-image.png'" class="shine-animate">
                                    <img :src="csrData ? getImage(csrData) : '/default-image.png'" alt="CSR Image">
                                </a>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12 mb-30">
                            <h5 class="title">Informasi Program</h5>
                            <hr style="border: 2px solid #0007cd;">

                            <div class="card shadow noborder">
                                <div class="card-body">
                                    <!-- Bidang CSR -->
                                    <div class="mb-3">
                                        <label class="form-label">Bidang CSR</label>
                                        <input type="text" class="form-control form-control-sm"
                                            :value="csrData ? csrData.uraian_bidang_csr : ''" disabled>
                                    </div>


                                    <div class="mb-3">
                                        <label class="form-label">Sub-Bidang CSR</label>
                                        <input type="text" class="form-control form-control-sm"
                                            :value="csrData ? csrData.uraian_bidang_sub_csr : ''" disabled>
                                    </div>

                                    <!-- Nama CSR -->
                                    <div class="mb-3">
                                        <label class="form-label">Nama CSR</label>
                                        <textarea class="form-control form-control-sm" rows="2"
                                            :value="csrData ? csrData.nama_csr : ''" disabled></textarea>
                                    </div>

                                    <!-- Jumlah Kebutuhan Program -->
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <label class="form-label">Jumlah Kebutuhan</label>
                                            <input type="text" class="form-control form-control-sm"
                                                :value="csrData ? csrData.jumlah + ' ' + csrData.satuan : ''" disabled>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Nilai / Unit</label>
                                            <input type="text" class="form-control form-control-sm"
                                                :value="csrData ? formatRupiah(csrData.nilai) + ' / ' + csrData.satuan : ''"
                                                disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="col-md-6 col-sm-6">
                            <h5 class="title">Pelaksanaan Program</h5>
                            <hr style="border: 2px solid #0007cd;">

                            <div class="row">
                                <div class="col-md-6 col-sm-6">
                                    <div class="card shadow noborder">
                                        <div class="card-body">
                                            <h6 class="title">Tanggal Mulai</h6>
                                            <div>
                                                {{ csrData ? UMUM.tglConvert(csrData.tanggal_mulai).tgl : '' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6 col-sm-6">
                                    <div class="card shadow noborder">
                                        <div class="card-body">
                                            <h6 class="title">Tanggal Selesai</h6>
                                            <div>{{ csrData ? UMUM.tglConvert(csrData.tanggal_selesai).tgl : '' }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div class="col-md-6 col-sm-6 mb-30">
                            <h5 class="title">Status Program</h5>
                            <hr style="border: 2px solid #0007cd;">

                            <div class="card shadow noborder">
                                <div v-if="csrData" class="card-body d-flex">
                                    <!-- Status -->
                                    <div class="flex-fill me-2">
                                        <h6 class="title mb-1">Status</h6>
                                        <span v-if="csrData.status === 1" class="badge text-bg-warning">Program CSR
                                            Baru</span>
                                        <button v-else-if="csrData.status === 2" @click="viewMitra(csrData.id)"
                                            class="badge text-bg-primary">Dalam Pengerjaan</button>
                                        <button v-else-if="csrData.status === 3" @click="viewMitra(csrData.id)"
                                            class="badge text-bg-secondary">Pengerjaan Sebagian</button>
                                        <button v-else-if="csrData.status === 4" @click="viewMitra(csrData.id)"
                                            class="badge text-bg-success">Selesai</button>
                                    </div>

                                    <!-- Jumlah Tersedia -->
                                    <div class="flex-fill me-2">
                                        <h6 class="title mb-1">Tersedia</h6>
                                        <input type="text" class="form-control form-control-sm"
                                            :value="csrData.jumlah_sisa" disabled>
                                    </div>

                                    <!-- Jumlah Terambil -->
                                    <div class="flex-fill">
                                        <h6 class="title mb-1">Terambil</h6>
                                        <input type="text" class="form-control form-control-sm" :value="jumlahTerambil"
                                            disabled>
                                    </div>
                                </div>
                                <!-- <div v-if="csrData && (csrData.status === 2 || csrData.status === 3 || csrData.status === 4)"
                                    class="mt-3">
                                    <button @click="viewMitra(csrData.id)" class="btn btn-outline-primary btn-sm w-100"
                                        style="font-size: 9pt; border-radius: 6px; transition: all 0.3s ease;">
                                        <i class="fas fa-eye"></i> Lihat Mitra
                                    </button>
                                </div> -->
                            </div>

                        </div>

                        <div class="col-md-12 col-sm-12 mb-30">
                            <h5>Deskripsi Program</h5>
                            <hr style="border: 2px solid #0007cd;">

                            <div class="card shadow noborder">
                                <div class="card shadow noborder">
                                    <div class="card-body">
                                        <div v-html="csrData ? csrData.deskripsi : ''"></div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div class="col-md-12 col-sm-12">
                            <h5>Alamat Program</h5>
                            <hr style="border: 2px solid #0007cd;">

                            <div class="card shadow noborder">
                                <div class="card-body">
                                    <div class="row g-2">
                                        <!-- Kecamatan -->
                                        <div class="col-md-6">
                                            <label class="form-label mb-1">Kecamatan</label>
                                            <input type="text" class="form-control form-control-sm"
                                                :value="csrData ? csrData.nama_kecamatan : ''" disabled>
                                        </div>
                                        <!-- Desa -->
                                        <div class="col-md-6">
                                            <label class="form-label mb-1">Desa</label>
                                            <input type="text" class="form-control form-control-sm"
                                                :value="csrData ? csrData.nama_desa : ''" disabled>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Alamat</label>
                                            <textarea class="form-control form-control-sm" rows="2"
                                                :value="csrData ? csrData.alamat : ''" disabled></textarea>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>




                    </div>
                </div>
            </div>
        </section>
        <!-- blog-area-end -->

        <!-- Modal untuk Lihat Mitra -->
        <div class="modal fade" id="mitraModal" tabindex="-1" aria-labelledby="mitraModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mitraModalLabel">Daftar Mitra/Perusahaan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="isLoadingMitra" class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Memuat data mitra...</p>
                        </div>
                        <div v-else-if="selectedMitra.length === 0" class="text-center text-muted">
                            <i class="fas fa-info-circle fa-2x"></i>
                            <p class="mt-2">Tidak ada mitra yang terdaftar untuk kegiatan ini.</p>
                        </div>
                        <ul v-else class="list-group">
                            <li v-for="(mitra, idx) in selectedMitra" :key="idx"
                                class="list-group-item d-flex justify-content-between align-items-center">
                                <span><strong>{{ mitra.nama_mitra }}</strong></span>
                                <span class="badge bg-primary">{{ mitra.jumlah_ambil}} {{ mitra.satuan }} - {{ formatRupiah( mitra.nilai)}}/{{ mitra.satuan }} </span>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import UMUM from '../../library/umum'; // sesuaikan path ke umum.js

export default {
    data() {
        return {
            UMUM: UMUM,
            csrData: null,
            // Data untuk modal mitra
            selectedMitra: [],
            isLoadingMitra: false

        }
    },

    computed: {
        jumlahTerambil() {
            if (!this.csrData) return 0;
            return this.csrData.jumlah - this.csrData.jumlah_sisa;
        }
    },
    methods: {


        async fetchCSRDetail(id) {
            try {
                const res = await fetch(this.$store.state.URL.KEGIATAN_CSR + "detailCSR", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                this.csrData = data.data;
            } catch (err) {
                console.error("Error fetching CSR detail:", err);
            }
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

        getStatusText(status) {
            switch (status) {
                case 1: return 'Program CSR Baru';
                case 2: return 'Dalam Pengerjaan';
                case 3: return 'Pengerjaan Sebagian';
                case 4: return 'Selesai';
                default: return '-';
            }
        },

        // Method untuk lihat mitra
        async viewMitra(csrId) {
            this.isLoadingMitra = true;
            this.selectedMitra = [];
            try {
                // Update endpoint ke "lihatmitra" dengan query string id
                const res = await fetch(this.$store.state.URL.KEGIATAN_CSR + "lihatmitra?id=" + csrId, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();
                // Parsing respons backend: { success: true, data: rows }
                if (data.success) {
                    this.selectedMitra = data.data || [];
                } else {
                    console.error("Error from backend:", data.message);
                    this.selectedMitra = [];
                }
            } catch (err) {
                console.error("Error fetching mitra:", err);
                this.selectedMitra = [];
            } finally {
                this.isLoadingMitra = false;
                // Buka modal menggunakan Bootstrap JS (pastikan Bootstrap JS sudah di-include)
                const modal = new bootstrap.Modal(document.getElementById('mitraModal'));
                modal.show();
            }
        }




    },
    mounted() {
        const csrId = this.$route.params.id;
        this.fetchCSRDetail(csrId);
    },
}
</script>