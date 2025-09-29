<template>
    <div class="about " style="padding:15px">
        <q-card bordered class="my-card">
            <q-card-section class="main2 text-white">
                <div class="row items-center q-col-gutter-md">
                    <div class="col-12 col-md-6">
                        <div class="text-h6 h_titleHead">Pengajuan Program Kegiatan CSR</div>
                    </div>

                    <!-- Filter Status -->
                    <div class="col-12 col-md-2">
                        <q-select v-model="filterku.status_pengajuan" :options="statusOptions" outlined dense square
                            emit-value map-options class="bg-white" @input="onStatusChange" />
                    </div>

                    <!-- Cari -->
                    <div class="col-12 col-md-4">
                        <div class="row">
                            <q-input v-model="cari_value" @keyup="cari_data()" outlined square dense
                                class="bg-white col q-mr-sm" />

                        </div>
                    </div>
                </div>

            </q-card-section>

        </q-card>


        <hr class="hrpagin2">





        <div class="row q-col-gutter-md">
            <!-- Filter Bidang Usaha -->
            <div class="col-12 col-md-6" v-if="tipe === 1 || tipe === 5">
                <span class="h_lable">Bidang Usaha</span>
                <q-select v-model="filterku.bidang_usaha_id" :options="bidangUsahaOptions" option-label="uraian"
                    option-value="id" emit-value map-options outlined dense class="bg-white"
                    @input="onChangeBidangUsahaFilter" />
            </div>

            <!-- Filter Perusahaan -->
            <div class="col-12 col-md-6" v-if="tipe === 1 || tipe === 5">
                <span class="h_lable">Perusahaan</span>
                <q-select v-model="filterku.perusahaan_id" :options="list_perusahaan_filter" option-label="nama"
                    option-value="users_id" label="-- SEMUA PERUSAHAAN --" emit-value map-options outlined dense
                    class="bg-white" @input="onChangePerusahaanFilter" />
            </div>


            <!-- Filter Bidang -->
            <div class="col-12 col-md-6">
                <span class="h_lable">Bidang CSR</span>
                <q-select v-model="filterku.bidang_csr_id" :options="bidangOptions" option-label="uraian"
                    option-value="id" emit-value map-options outlined dense class="bg-white" @input="onChangeBidang" />
            </div>

            <!-- Filter Sub-Bidang -->
            <div class="col-12 col-md-6">
                <span class="h_lable">Sub-Bidang CSR</span>
                <q-select v-model="filterku.bidang_sub_csr_id" :options="list_sub_bidang_filter" option-label="uraian"
                    option-value="id" label="-- SEMUA SUB-BIDANG --" emit-value map-options outlined dense
                    class="bg-white" @input="getView" />
            </div>


        </div>
        <hr class="hrpagin2">

        <div class="tbl_responsive">
            <!-- =================================================== KONTENT =========================================================== -->
            <table width="100%">
                <tr class="h_table_head main1 text-white ">
                    <th width="5%" class="text-center">No</th>
                    <th width="5%">Status</th>
                    <th width="20%">Nama Program</th>
                    <th width="10%">Kecamatan</th>
                    <th width="5%">Tanggal Pengajuan</th>
                    <th width="15%">Mitra/Perusahaan</th>
                    <th width="5%">Jumlah Pengambilan</th>
                    <th width="5%">Tersedia</th>
                    <th width="30%" class="text-center">Act</th>
                    <!-- <th width="30%">Keterangan</th> -->
                    <!-- <th width="10%"></th> -->
                </tr>
                <tr class="h_table_body" v-for="(data, index) in list_data" :key="data.id + '-' + index"
                    :class="{ 'row-selesai': data.status === 4 && data.status_pengajuan === 2 }">
                    <td class="text-center">{{ indexing(index + 1) }}.</td>
                    <td class="text-center">
                        <a href="javascript:void(0)" class="removeTextDecoration" @click="lihatKeterangan(data)">
                            <q-btn v-if="data.status_pengajuan == 1" round glossy size="xs" color="orange"
                                icon="hourglass_empty" />
                            <q-btn v-if="data.status_pengajuan == 2" round size="xs" glossy color="green" icon="done" />
                            <q-btn v-if="data.status_pengajuan == 3" round glossy size="xs" color="red" icon="close" />
                        </a>
                    </td>
                    <td>
                        <div>
                            {{ data.nama_kegiatan }}
                        </div>
                        <div class="text-blue text-bold" style="font-size: 12px;">
                            {{ data.uraian_bidang_csr }}, {{ data.uraian_bidang_sub_csr }}
                        </div>
                    </td>

                    <td>
                        <div>{{ data.nama_kecamatan }}</div>
                        <div class="text-blue text-bold" style="font-size: 12px;">
                            {{ data.nama_desa }}
                        </div>
                    </td>


                    <td>{{ UMUM.tglConvert(data.tgl_pengajuan) }} </td>
                    <td>
                        <div>{{ data.nama_perusahaan }}</div>
                        <div class="text-blue text-bold" style="font-size: 12px;">
                            {{ data.bidang_perusahaan }}
                        </div>
                    </td>
                    <td>{{ data.jumlah_ambil }} {{ data.satuan }}</td>
                    <td :style="{ backgroundColor: data.jumlah_sisa === 0 ? '#ffcccc' : 'transparent' }">
                        {{ data.jumlah_sisa }} {{ data.satuan }}
                    </td>
                    <td class="text-center q-gutter-sm">
                        <!-- Tombol Lihat Detil -->
                        <q-btn glossy color="blue" label="Lihat Detil" size="sm"
                            @click="selectData(data); mdl_lihat = true">
                            <q-tooltip content-class="bg-blue-9" content-style="font-size: 13px">
                                Lihat Detil
                            </q-tooltip>
                        </q-btn>

                        <!-- Tombol Setujui -->
                        <q-btn v-if="tipe === 1 || tipe === 5" glossy color="green" label="Setujui" size="sm"
                            :disable="data.status_pengajuan == 2 || data.status_pengajuan == 3 || data.jumlah_sisa === 0 || data.jumlah_ambil > data.jumlah_sisa"
                            @click="approvePengajuan(data.id)">
                            <q-tooltip content-class="bg-green-9" content-style="font-size: 13px">
                                Setujui Pengajuan
                            </q-tooltip>
                        </q-btn>

                        <!-- Tombol Tolak -->
                        <q-btn v-if="tipe === 1 || tipe === 5" glossy color="red" label="Tolak" size="sm"
                            :disable="data.status_pengajuan == 2 || data.status_pengajuan == 3"
                            @click="tolakPengajuan(data.id)">
                            <q-tooltip content-class="bg-red-9" content-style="font-size: 13px">
                                Tolak Pengajuan
                            </q-tooltip>
                        </q-btn>

                        <!-- Tombol upload bukti -->
                        <q-btn v-if="tipe === 4 && data.status_pengajuan == 2" glossy color="purple"
                            label="Upload Eviden" size="sm" @click="openUploadModal(data)">
                            <q-tooltip content-class="bg-purple-9" content-style="font-size: 13px">
                                Upload Bukti Program
                            </q-tooltip>
                        </q-btn>

                        <q-btn v-if="tipe === 1 || tipe === 5 && data.status_pengajuan == 2 && data.jml_eviden > 0"
                            glossy color="purple" label="Lihat Eviden" size="sm" :disable="data.status_pengajuan == 3"
                            @click="lihatEviden(data)">
                            <q-tooltip content-class="bg-blue-9" content-style="font-size: 13px">
                                Lihat Bukti Program
                            </q-tooltip>
                        </q-btn>

                    </td>

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


        <!-- ===================== MODAL TOLAK ===================== -->

        <q-dialog v-model="mdl_catatan_admin" persistent>
            <q-card class="mdl-md">
                <q-card-section class="bg-orange text-white">
                    <div class="text-h6">Evaluasi Pengajuan</div>
                </q-card-section>

                <q-card-section>
                    <span class="h_lable">Hasil Evaluasi</span>
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

        <!-- MODAL DETAIL PENGAJUAN -->
        <q-dialog v-model="mdl_lihat" persistent>
            <q-card class="mdl-md">

                <!-- Header -->
                <q-card-section class="bg-primary text-white flex items-center">
                    <q-icon name="description" size="md" class="q-mr-sm" />
                    <div class="text-h6">Detail Pengajuan Program CSR</div>
                </q-card-section>

                <q-separator />

                <!-- Konten -->
                <q-card-section class="q-gutter-md">

                    <!-- Lampiran File -->
                    <div>
                        <div class="text-subtitle1 text-bold q-mb-sm">📂 Lampiran File</div>
                        <div v-if="selectedItem.file_name">
                            <q-img :src="file_path + selectedItem.file_name" spinner-color="primary"
                                style="max-height: 400px; cursor: pointer; border: 1px solid #ddd; border-radius: 6px;"
                                @click="downloadFile(selectedItem.file_name)" />
                        </div>
                        <div v-else>
                            <span class="text-grey">Tidak ada file</span>
                        </div>
                    </div>

                    <!-- Info Program -->
                    <div>
                        <div class="text-subtitle1 text-bold q-mb-sm">📌 Informasi Program</div>
                        <q-list dense bordered separator class="rounded-borders">
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Nama Program</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.nama_kegiatan }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Bidang</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.uraian_bidang_csr || '-'
                                    }}</q-item-section>
                            </q-item>
                            <q-item v-if="selectedItem.uraian_bidang_sub_csr">
                                <q-item-section class="col-3 text-weight-medium"><b>Sub Bidang</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.uraian_bidang_sub_csr }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Jumlah Tersedia</b></q-item-section>
                                <q-item-section>
                                    <q-badge color="amber" text-color="black"
                                        :label="selectedItem.jumlah_sisa + ' ' + selectedItem.satuan" />
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Jumlah Total</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.jumlah }} {{ selectedItem.satuan
                                    }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Nilai Program</b></q-item-section>
                                <q-item-section class="col-9">Rp {{ Number(selectedItem.nilai).toLocaleString('id-ID')
                                    }} / {{ selectedItem.satuan }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Mulai</b></q-item-section>
                                <q-item-section class="col-9">{{ UMUM.tglConvert(selectedItem.tanggal_mulai)
                                    }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Selesai</b></q-item-section>
                                <q-item-section class="col-9">{{ UMUM.tglConvert(selectedItem.tanggal_selesai)
                                    }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Alamat</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.alamat }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Kecamatan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.nama_kecamatan }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Desa</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.nama_desa }}</q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                    <!-- Info Perusahaan -->
                    <div class="q-mt-md">
                        <div class="text-subtitle1 text-bold q-mb-sm">🏢 Informasi Perusahaan</div>
                        <q-list dense bordered separator class="rounded-borders">
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Nama Perusahaan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.nama_perusahaan }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Email
                                        Perusahaan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.email_perusahaan || '-'
                                    }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Telp Perusahaan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.telp_perusahaan || '-' }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Alamat
                                        Perusahaan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.alamat_perusahaan || '-'
                                    }}</q-item-section>
                            </q-item>
                        </q-list>

                        <q-separator spaced />

                        <!-- Penanggung Jawab -->
                        <div class="text-subtitle2 text-bold q-mb-sm">👤 Penanggung Jawab</div>
                        <q-list dense bordered separator class="rounded-borders">
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Nama</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.nama_pj }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Jabatan</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.jabatan_pj }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>Email</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.email_pj }}</q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section class="col-3 text-weight-medium"><b>No Hp</b></q-item-section>
                                <q-item-section class="col-9">{{ selectedItem.hp_pj }}</q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                </q-card-section>

                <q-separator />

                <!-- Actions -->
                <q-card-actions align="right" class="q-pa-md">
                    <q-btn label="Batal" color="negative" v-close-popup />
                </q-card-actions>

            </q-card>
        </q-dialog>

        <!-- ===================== MODAL UPLOAD ===================== -->
        <!-- ===================== MODAL UPLOAD ===================== -->
        <q-dialog v-model="mdl_upload_eviden" persistent>
            <q-card class="mdl-md">
                <q-card-section class="bg-purple text-white">
                    <div class="text-h6">Upload Bukti Program CSR</div>
                </q-card-section>

                <q-card-section>
                    <q-input v-model="uploadData.keterangan" outlined dense label="Keterangan" type="textarea"
                        class="q-mb-md bg-white" />

                    <!-- Q-FILE (lebih simpel dari Q-Uploader) -->
                    <q-file v-model="uploadData.file" label="Pilih Foto" accept="image/*" outlined dense use-chips>
                        <template v-slot:append>
                            <q-icon name="attach_file" />
                        </template>
                    </q-file>

                    <!-- 🔹 Pembatas -->
                    <hr class="hrpagin2" />

                    <!-- LIST DATA BUKTI -->
                    <table width="100%">
                        <tr class="h_table_head bg-purple text-white">
                            <th width="5%" class="text-center">No</th>
                            <th width="20%">Foto</th>
                            <th width="55%">Keterangan</th>
                            <th width="20%" class="text-center">Aksi</th>
                        </tr>
                        <tr class="h_table_body" v-for="(row, index) in list_data_bukti" :key="row.id + '-' + index">
                            <td class="text-center">{{ index + 1 }}</td>
                            <td>
                                <a :href="file_path + row.file_name" target="_blank" class="text-blue">
                                    <img :src="file_path + row.file_name" alt="foto"
                                        style="width:60px; height:auto; border-radius:4px;" />
                                </a>
                            </td>
                            <td>{{ row.keterangan }}</td>
                            <td class="text-center q-gutter-sm">

                                <!-- Hapus -->
                                <q-btn dense round color="red" icon="delete" @click="hapusBukti(row.id)">
                                    <q-tooltip>Hapus</q-tooltip>
                                </q-btn>
                            </td>
                        </tr>
                        <tr v-if="list_data_bukti.length === 0">
                            <td colspan="4" class="text-center text-grey">
                                Belum ada bukti diunggah
                            </td>
                        </tr>
                    </table>
                </q-card-section>

                <q-card-actions align="right" class="bg-grey-4">
                    <q-btn label="Upload" class="bg-purple text-white" @click="submitUploadEviden" />
                    <q-btn label="Batal" color="negative" v-close-popup @click="resetUploadModal" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- ===================== MODAL UPLOAD ===================== -->

        <!-- ===================== MODAL LIHAT UPLOAD DARI PERUSAHAAN ===================== -->
        <q-dialog v-model="mdl_lihat_eviden" persistent>
            <q-card class="mdl-md">
                <q-card-section class="bg-purple text-white">
                    <div class="text-h6">Daftar Bukti Program CSR</div>
                </q-card-section>

                <q-card-section>
                    <table width="100%">
                        <tr class="h_table_head bg-purple text-white">
                            <th width="10%">No</th>
                            <th width="30%">Foto</th>
                            <th width="50%">Keterangan</th>
                        </tr>
                        <tr class="h_table_body" v-for="(row, idx) in list_data_bukti" :key="row.id">
                            <td class="text-center">{{ idx + 1 }}</td>
                            <td>
                                <a :href="$store.state.url.URL_APP + 'uploads/' + row.file_name" target="_blank">
                                    <img :src="$store.state.url.URL_APP + 'uploads/' + row.file_name" alt="bukti"
                                        width="80" />
                                </a>
                            </td>
                            <td>{{ row.keterangan }}</td>
                        </tr>
                    </table>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Tutup" color="red" v-close-popup />
                    <q-btn glossy color="green" label="Selesaikan Program"
                        :disable="selectedData && selectedData.status == 4"
                        @click="selesaikanProgram(selectedData.id)" />
                </q-card-actions>
            </q-card>
        </q-dialog>


        <!-- ===================== MODAL LIHAT UPLOAD DARI PERUSAHAAN ===================== -->






    </div>
</template>


<script>

import UMUM from "../../library/umum.js";
export default {
    data() {
        return {

            UMUM: UMUM,

            list_data: [],

            status: 4,
            mdl_add: false,
            mdl_edit: false,
            mdl_delete: false,
            mdl_kembalikan: false,
            mdl_keterangan: false,
            mdl_lihat: false,
            mdl_catatan_admin: false,
            alert: false,
            simpan1: false,
            selectedItem: {},
            cari_value: "",
            page_first: 1,
            page_last: 1,
            page_limit: 8,
            total: 0,
            mdlAmbil: false,
            selectedProgram: {},
            jumlahAmbil: 0,
            mitra: {},
            ambilSemua: false,
            catatanAmbil: '',

            tipe: null, // simpan tipe user


            form: {
                bidang_csr_id: null,
                bidang_sub_csr_id: null,
                nama_csr: "",
                deskripsi: "",
                jumlah: null,
                satuan: "",
                nilai: null,
                tanggal_mulai: "",
                tanggal_selesai: "",
                kecamatan_id: null,
                desa_id: null,
                alamat: "",
                file_name: null  // 🔹 untuk file upload
            },

            mitra: {
                nama_perusahaan: '',
                email_perusahaan: '',
                telp_perusahaan: '',
                alamat_perusahaan: '',
                nama_pj: '',
                jabatan: '',
                email_pj: '',
                hp_pj: ''
            },
            list_bidang: [],
            list_sub_bidang: [],
            list_kecamatan: [],
            list_kecamatan_master: [], // simpan data asli
            list_desa: [],
            list_desa_master: [],
            file_path: this.$store.state.url.URL_APP + "uploads/",


            filterku: {
                bidang_usaha_id: "",
                perusahaan_id: "",
                bidang_csr_id: "",
                bidang_sub_csr_id: "",
                status_pengajuan: ""
            },


            list_bidang_filter: [],
            list_sub_bidang_filter: [],

            // hasil data yang difilter
            dataView: [],

            list_kecamatan_filter: [],
            list_desa_filter: [],

            statusOptions: [
                { label: 'Semua Status', value: '' },
                { label: 'Diproses', value: 1 },
                { label: 'Diterima', value: 2 },
                { label: 'Ditolak', value: 3 },
            ],

            list_perusahaan_filter: [],
            bidangOptions: [], // <- ubah dari computed ke data
            bidangUsahaOptions: [], // <- ubah dari computed ke data

            mdl_upload_eviden: false,
            uploadData: {
                id: null,        // simpan id program
                keterangan: '',
                file: null
            },
            list_data_bukti: [],

            columns_bukti: [
                { name: 'foto', label: 'Foto', field: 'file_name' },
                { name: 'keterangan', label: 'Keterangan', field: 'keterangan' },
                { name: 'aksi', label: 'Aksi', field: 'aksi' }
            ],

            mdl_lihat_eviden: false,
            selectedData: null, // ✅ tambahkan ini
            selectedItemEviden: {
                keterangan: '',
                files: []
            }

        }


    },


    methods: {

        async lihatEviden(item) {
            const res = await fetch(this.$store.state.url.LIST_PENGAJUAN + 'getEviden?id=' + item.id, {
                headers: { authorization: "kikensbatara " + localStorage.token }
            });
            this.list_data_bukti = await res.json();
            this.mdl_lihat_eviden = true;
            this.selectedData = item; // ✅ simpan data yg dipilih
        },

        openUploadModal(item) {
            this.uploadData.id = item.id
            this.uploadData.keterangan = ''
            this.uploadData.file = null
            this.mdl_upload_eviden = true
            this.getListBukti()
        },

        async getListBukti() {
            if (!this.uploadData.id) return
            const res = await fetch(
                this.$store.state.url.LIST_PENGAJUAN + 'getEviden?id=' + this.uploadData.id,
                { headers: { authorization: 'kikensbatara ' + localStorage.token } }
            )
            const data = await res.json()
            this.list_data_bukti = data
        },

        async hapusBukti(id) {
            if (!confirm("Yakin hapus bukti ini?")) return
            await fetch(this.$store.state.url.LIST_PENGAJUAN + 'deleteEviden?id=' + id, { method: 'DELETE' })
            this.getListBukti()
        },

        resetUploadModal() {
            this.uploadData.keterangan = ''
            this.uploadData.file = null
        },

        async submitUploadEviden() {
            if (!this.uploadData.keterangan) {
                this.Notify('Keterangan harus diisi', 'negative', 'warning')
                return
            }

            if (!this.uploadData.file) {
                this.Notify('Pilih 1 foto terlebih dahulu', 'negative', 'warning')
                return
            }

            const formData = new FormData()
            formData.append('id', this.uploadData.id)
            formData.append('keterangan', this.uploadData.keterangan)
            formData.append('file', this.uploadData.file)  // 🔥 harus "file"

            try {
                const res = await fetch(this.$store.state.url.LIST_PENGAJUAN + 'uploadEviden', {
                    method: 'POST',
                    headers: {
                        authorization: 'kikensbatara ' + localStorage.token
                    },
                    body: formData
                })

                const data = await res.json()
                if (data.success) {
                    this.Notify('Bukti berhasil diupload', 'positive', 'check_circle_outline')
                    this.resetUploadModal()
                    this.mdl_upload_eviden = false
                    this.getView() // refresh list
                } else {
                    this.Notify(data.message, 'negative', 'error_outline')
                }
            } catch (err) {
                console.error(err)
                this.Notify('Terjadi kesalahan server', 'negative', 'error_outline')
            }
        },
        previewFile(row) {
            window.open(this.fileBaseUrl + row.file_name, '_blank')
        },



        hapusBukti(id) {
            if (!confirm("Yakin hapus bukti ini?")) return;

            fetch(this.$store.state.url.LIST_PENGAJUAN + "removeEviden", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({ id })
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.Notify("Bukti berhasil dihapus", "positive", "check_circle_outline");
                        this.getListBukti();
                    } else {
                        this.Notify(res_data.message || "Gagal hapus bukti", "negative", "error");
                    }
                })
                .catch(err => {
                    this.Notify("Error: " + err.message, "warning", "error");
                });
        },
        selesaikanProgram: async function (id) {
            try {
                // konfirmasi dulu
                this.mdl_lihat_eviden = false;
                await UMUM.notifApprove();

                const res = await fetch(this.$store.state.url.LIST_PENGAJUAN + "selesaikanProgram", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "kikensbatara " + localStorage.token
                    },
                    body: JSON.stringify({ id })
                });

                const result = await res.json();
                if (result.success) {
                    this.Notify("Program berhasil diselesaikan", "positive", "check_circle_outline");
                    this.mdl_lihat_eviden = false;
                    this.getView(); // refresh tabel utama
                } else {
                    this.Notify(result.message || "Gagal menyelesaikan program", "negative", "error_outline");
                }
            } catch (err) {
                // kalau user batal di notifApprove, dia juga bakal masuk ke sini
                console.error(err);
                this.Notify("Error: " + err.message, "negative", "error");
            }
        },

        downloadFile(fileName) {
            if (fileName) {
                window.open(this.file_path + fileName, "_blank");
            }
        },

        lihatKeterangan: function (item) {
            this.selectedItem = { ...item };
            this.mdl_keterangan = true; // buka modal keterangan
        },

        tolakPengajuan: async function (id) {
            // Cari data sesuai id dan simpan di selectedItem
            const item = this.list_data.find(d => d.id === id);
            if (!item) return;

            this.selectedItem = { ...item, catatan_admin: '' };
            this.mdl_catatan_admin = true; // buka modal
        },


        // Tombol Evaluasi di modal
        submitTolak: async function () {
            if (!this.selectedItem.catatan_admin) {
                this.Notify('Catatan harus diisi', 'negative', 'warning');
                return;
            }

            try {
                const res = await fetch(this.$store.state.url.LIST_PENGAJUAN + "tolakPengajuan", {
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
                    this.Notify('Pengajuan ditolak', 'negative', 'cancel');
                    this.getView(); // refresh list
                    this.mdl_catatan_admin = false; // tutup modal
                } else {
                    this.Notify(data.message, 'negative', 'error_outline');
                }

            } catch (err) {
                console.error(err);
                this.Notify('Terjadi kesalahan server', 'negative', 'error_outline');
            }
        },

        selectData(item) {
            this.selectedItem = item;
            this.mdl_lihat = true; // buka modal
        },


        onStatusChange(val) {
            this.getView()
        },


        onChangeBidang(val) {
            this.filterku.bidang_sub_csr_id = ""; // reset sub-bidang
            this.getSubBidangFilter(val);
            this.getView(); // refresh data
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


        getBidang() {
            fetch(this.$store.state.url.URL_DM_BID + "bidang", {
                headers: {
                    authorization: "kikensbatara " + localStorage.token
                }
            })
                .then(res => res.json())
                .then(res_data => {
                    this.list_bidang = res_data
                })
        },
        getMitra(userId) {
            fetch(this.$store.state.url.KEGIATAN_CSR + "mitra/" + userId, {
                method: "GET",
                headers: {
                    authorization: "kikensbatara " + localStorage.token
                }
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.mitra = res_data.data
                    } else {
                        this.Notify("Gagal mengambil data mitra", "negative", "error_outline")
                    }
                })
                .catch(err => {
                    console.error("❌ Error:", err)
                    this.Notify("Terjadi kesalahan server", "negative", "error_outline")
                })
        },


        getSubBidang() {
            // reset sub bidang dulu biar tidak nempel
            this.form.bidang_sub_csr_id = null
            this.list_sub_bidang = []

            if (!this.form.bidang_csr_id) {
                return
            }

            fetch(this.$store.state.url.URL_DM_BID + "sub_bidang", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({
                    bidang_csr_id: this.form.bidang_csr_id
                })
            })
                .then(res => res.json())
                .then(res_data => {
                    this.list_sub_bidang = res_data
                })
        },



        // ambil data utama
        getView() {
            this.$store.commit("shoWLoading");
            fetch(this.$store.state.url.LIST_PENGAJUAN + "view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({
                    status_pengajuan: this.filterku.status_pengajuan,
                    bidang_usaha_id: this.filterku.bidang_usaha_id,   // 🔎 filter perusahaan
                    perusahaan_id: this.filterku.perusahaan_id,   // 🔎 filter perusahaan
                    bidang_csr_id: this.filterku.bidang_csr_id,       // 🔎 filter bidang CSR
                    bidang_sub_csr_id: this.filterku.bidang_sub_csr_id, // 🔎 filter sub bidang CSR
                    cari_value: this.cari_value,
                    data_ke: this.page_first,
                    page_limit: this.page_limit,
                    tipe: this.tipe
                })
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.list_data = res_data.data;
                        this.total = res_data.total || res_data.data.length;
                        this.page_last = Math.ceil(this.total / this.page_limit);
                    }
                    this.$store.commit("hideLoading");
                })
                .catch(err => {
                    console.error("❌ Error getView:", err);
                    this.$store.commit("hideLoading");
                });
        },


        approvePengajuan: async function (id) {
            await UMUM.notifApprove();
            fetch(this.$store.state.url.LIST_PENGAJUAN + "approvePengajuan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({ id }) // kirim id saja
            })
                .then(res => res.json())
                .then(res_data => {
                    if (res_data.success) {
                        this.Notify('Pengajuan disetujui', 'positive', 'check_circle_outline');
                        this.getView(); // refresh list
                    } else {
                        this.Notify(res_data.message, 'negative', 'error_outline');
                    }
                })
                .catch(err => console.error(err));
        },



        getBidangFilter() {
            fetch(this.$store.state.url.URL_DM_BID + "bidang", {
                headers: {
                    authorization: "kikensbatara " + localStorage.token
                }
            })
                .then(res => res.json())
                .then(res_data => {
                    this.bidangOptions = [
                        { id: "", uraian: "-- SEMUA BIDANG --" },
                        ...res_data.map(b => ({
                            ...b,
                            id: b.id.toString()  // pastikan tipe sama dengan v-model
                        }))
                    ];
                })
        },

        getSubBidangFilter() {
            this.filterku.bidang_sub_csr_id = null
            this.list_sub_bidang_filter = []

            if (!this.filterku.bidang_csr_id) return

            fetch(this.$store.state.url.URL_DM_BID + "sub_bidang", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({
                    bidang_csr_id: this.filterku.bidang_csr_id
                })
            })
                .then(res => res.json())
                .then(res_data => {
                    this.list_sub_bidang_filter = res_data
                })
        },


        //   ================ FILTER BIDANG USAHA DAN PERUSAHAAN ==================
        getBidangUsahaFilter() {
            fetch(this.$store.state.url.DATA_MITRA + "bidang", {
                headers: { authorization: "kikensbatara " + localStorage.token }
            })
                .then(res => res.json())
                .then(res_data => {
                    this.bidangUsahaOptions = [
                        { id: "", uraian: "-- SEMUA BIDANG USAHA --" },
                        ...res_data
                    ]
                })
                .catch(err => console.error("❌ Error fetch bidang:", err))
        },

        onChangeBidangUsahaFilter(val) {
            this.filterku.bidang_usaha_id = val
            this.filterku.perusahaan_id = ""
            this.getPerusahaanFilter()
            this.getView()
        },

        getPerusahaanFilter() {
            if (!this.filterku.bidang_usaha_id) {
                this.list_perusahaan_filter = []
                return
            }

            fetch(this.$store.state.url.DATA_MITRA + "byBidang", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: "kikensbatara " + localStorage.token
                },
                body: JSON.stringify({
                    bidang_usaha_id: this.filterku.bidang_usaha_id
                })
            })
                .then(res => res.json())
                .then(res_data => {
                    this.list_perusahaan_filter = res_data
                })
                .catch(err => {
                    console.error("❌ Error fetch perusahaan:", err)
                })
        },

        onChangePerusahaanFilter(val) {
            this.filterku.perusahaan_id = val
            this.getView()
        },

        //   ================ FILTER BIDANG USAHA DAN PERUSAHAAN ==================



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

        openEditModal(item) {
            this.selectedItem = item;

            // set form
            this.form = { ...item };

            // isi sub-bidang sesuai bidang
            if (this.form.bidang_csr_id) {
                this.getSubBidang(this.form.bidang_csr_id);
            }

            // buka modal
            this.mdl_edit = true;
        }



    },
    mounted() {

        const get_profile = JSON.parse(localStorage.profile);
        this.tipe = Number(get_profile.profile.db_csrkonsel); // ambil db_csrkonsel


        // simpan data mitra (kalau yang login memang mitra)
        this.mitra = {
            id: get_profile._id,
            nama: get_profile.profile.nama,
            username: get_profile.username
        }


        // jalankan ketika halaman pertama kali dibuka
        this.getView();
        // this.getDesaFilter();
        this.getBidang();
        this.getSubBidang();
        this.getBidangFilter();
        this.getBidangUsahaFilter();
        // this.getSubBidangFilter();
    }
}
</script>