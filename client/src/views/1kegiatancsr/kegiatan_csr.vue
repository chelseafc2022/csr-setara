<template>
  <div class="about " style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Kegiatan CSR</div>
          </div>

          <!-- Filter Status -->
          <div class="col-12 col-md-2">
            <q-select v-model="filterku.status" :options="statusOptions" outlined dense square emit-value map-options
              class="bg-white" @input="onStatusChange" />
          </div>

          <!-- Cari + Tombol Add -->
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square dense class="bg-white col q-mr-sm" />



              <q-btn v-if="tipe == 1 || tipe == 5" glossy class="col-auto" color="orange-14" @click="mdl_add = true"
                dense icon="add">
                <q-tooltip content-class="bg-orange-14" content-style="font-size: 13px">
                  Click untuk menambah data
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

      </q-card-section>

    </q-card>


    <hr class="hrpagin2">





    <div class="row q-col-gutter-md">
      <!-- Filter Kecamatan -->
      <div class="col-12 col-md-6">
        <span class="h_lable">Kecamatan</span>
        <q-select v-model="filterku.kecamatan_id" :options="kecamatanOptions" option-label="nama_kecamatan"
          option-value="kecamatan_id" emit-value map-options outlined dense class="bg-white"
          @input="onChangeKecamatanFilter" />

      </div>

      <!-- Filter Desa -->
      <div class="col-12 col-md-6">
        <span class="h_lable">Desa</span>
        <q-select v-model="filterku.desa_id" :options="list_desa_filter" option-label="nama_des_kel"
          option-value="des_kel_id" label="-- SEMUA DESA --" emit-value map-options outlined dense class="bg-white"
          @input="onChangeDesa" />

      </div>


      <!-- Filter Bidang -->
      <div class="col-12 col-md-6">
        <span class="h_lable">Bidang CSR</span>
        <q-select v-model="filterku.bidang_csr_id" :options="bidangOptions" option-label="uraian" option-value="id"
          emit-value map-options outlined dense class="bg-white" @input="onChangeBidang" />
      </div>

      <!-- Filter Sub-Bidang -->
      <div class="col-12 col-md-6">
        <span class="h_lable">Sub-Bidang CSR</span>
        <q-select v-model="filterku.bidang_sub_csr_id" :options="list_sub_bidang_filter" option-label="uraian"
          option-value="id" label="-- SEMUA SUB-BIDANG --" emit-value map-options outlined dense class="bg-white"
          @input="getView" />
      </div>


    </div>
    <hr class="hrpagin2">

    <div class="row q-mt-md q-col-gutter-md">
      <div v-for="item in dataView" :key="item.id" class="col-12 col-sm-6 col-md-4">
        <q-card bordered class="card-item">

          <div class="img-wrapper"
            style="height: 250px; position: relative; overflow: hidden; border-bottom: 1px solid #e0e0e0;">
            <q-img :src="item.file_name ? file_path + item.file_name : 'https://cdn.quasar.dev/img/chicken-salad.jpg'"
              spinner-color="primary" style="width: 100%; height: 100%;" :contain="true" />


            <div style="position: absolute; top: 10px; left: 10px;">
              <q-chip v-if="item.status == 1" color="orange-5" text-color="white" icon="new_releases" dense>
                Program CSR Baru
              </q-chip>
              <q-chip v-else-if="item.status == 2" color="blue-6" text-color="white" icon="autorenew" dense>
                Dalam Pengerjaan
              </q-chip>
              <q-chip v-else-if="item.status == 3" color="deep-purple-5" text-color="white" icon="hourglass_bottom"
                dense>
                Pengerjaan Sebagian
              </q-chip>
              <q-chip v-else-if="item.status == 4" color="green-6" text-color="white" icon="check_circle" dense>
                Selesai
              </q-chip>
            </div>
          </div>


          <q-card-section style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="text-h8 q-mb-xs" style="font-weight: 500;">{{ item.nama_csr }}</div>
              <div class="text-subtitle2 text-grey q-mb-sm">
                <b>{{ item.uraian_bidang_csr }}</b>
                <span v-if="item.uraian_bidang_sub_csr"> | {{ item.uraian_bidang_sub_csr }}</span>
              </div>
            </div>

            <div class="column q-gutter-xs text-subtitle2 text-dark">
              <div>
                Jumlah Kebutuhan Program: <b>{{ item.jumlah }}</b> {{ item.satuan }}
              </div>
              <div>
                Nilai : <b>Rp {{ Number(item.nilai).toLocaleString('id-ID') }} / {{ item.satuan }}</b>
              </div>
            </div>
          </q-card-section>

          <q-separator />


          <q-card-actions align="right" class="q-pt-sm">
            <q-btn v-if="tipe == 4 && (item.status == 1 || item.status == 3)" color="orange-14" text-color="white"
              label="Ambil Program" glossy rounded dense icon="gavel" @click="ambilProgram(item)">
              <q-tooltip content-class="bg-orange-14" content-style="font-size: 13px">
                Ambil program CSR ini
              </q-tooltip>
            </q-btn>

            <q-btn round dense color="primary" icon="visibility" @click="onItemClick(item, 'lihat')">
              <q-tooltip content-class="bg-blue-4">Lihat Detil</q-tooltip>
            </q-btn>

            <q-btn v-if="tipe == 1 || tipe == 5" round dense color="amber" icon="edit"
              @click="onItemClick(item, 'edit')" :disable="item.status !== 1">
              <q-tooltip content-class="bg-amber-6">Edit Program</q-tooltip>
            </q-btn>

            <q-btn v-if="tipe == 1 || tipe == 5" round dense color="negative" icon="delete"
              @click="onItemClick(item, 'delete')" :disable="item.status !== 1">
              <q-tooltip content-class="bg-red-6">Hapus Program</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>



      </div>


    </div>

    <hr class="hrpagin">
    <br>
    <div class="flex flex-center">
      <q-pagination v-model="page_first" :max="page_last" :max-pages="4" color="grey-6" :direction-links="true"
        :boundary-links="true" icon-first="skip_previous" icon-last="skip_next" icon-prev="fast_rewind"
        icon-next="fast_forward" @input="getView" />
    </div>


    <!-- ===================== MODAL ADD KEGIATAN CSR ===================== -->
    <q-dialog v-model="mdl_add" persistent>
      <q-card class="mdl-md">
        <q-card-section class="main2 text-white">
          <div class="text-h6 h_modalhead">Tambah Kegiatan CSR</div>
        </q-card-section>

        <form @submit.prevent="addData()">

          <q-card-section class="q-pt-none">

            <hr class="hrpagin2">

            <!-- BIDANG CSR -->
            <span class="h_lable">Bidang CSR</span>
            <q-select v-model="form.bidang_csr_id" :options="list_bidang" option-value="id" option-label="uraian"
              emit-value required map-options outlined square dense class="bg-white margin_btn" @input="getSubBidang" />

            <!-- SUB BIDANG CSR -->
            <span class="h_lable">Sub Bidang CSR</span>
            <q-select v-model="form.bidang_sub_csr_id" :options="list_sub_bidang" option-value="id"
              option-label="uraian" emit-value map-options outlined square dense class="bg-white margin_btn" />

            <!-- NAMA CSR -->
            <span class="h_lable">Nama CSR</span>
            <q-input v-model="form.nama_csr" outlined square required :dense="true" class="bg-white margin_btn" />

            <!-- DESKRIPSI CSR -->
            <span class="h_lable">Deskripsi / Keterangan CSR</span>
            <q-input v-model="form.deskripsi" type="textarea" outlined square :dense="true"
              class="bg-white margin_btn" />

            <!-- JUMLAH KEBUTUHAN -->
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <span class="h_lable">Jumlah</span>
                <q-input v-model="form.jumlah" type="number" outlined required square :dense="true"
                  class="bg-white margin_btn" />
              </div>
              <div class="col-4">
                <span class="h_lable">Satuan</span>
                <q-input v-model="form.satuan" outlined required square :dense="true" class="bg-white margin_btn" />
              </div>
              <div class="col-4">
                <span class="h_lable">Nilai Perkiraan</span>
                <q-input v-model="form.nilai" type="number" outlined required square :dense="true"
                  class="bg-white margin_btn" />
              </div>
            </div>

            <!-- TANGGAL MULAI & SELESAI -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <span class="h_lable">Tanggal Mulai</span>
                <q-input v-model="form.tanggal_mulai" type="date" outlined required square :dense="true"
                  class="bg-white margin_btn" />
              </div>
              <div class="col-6">
                <span class="h_lable">Tanggal Selesai</span>
                <q-input v-model="form.tanggal_selesai" type="date" outlined required square :dense="true"
                  class="bg-white margin_btn" />
              </div>
            </div>

            <!-- KECAMATAN -->
            <span class="h_lable">Kecamatan</span>
            <q-select v-model="form.kecamatan_id" :options="list_kecamatan" option-value="kecamatan_id"
              option-label="nama_kecamatan" emit-value map-options outlined square dense use-input fill-input
              hide-selected input-debounce="0" @filter="filterKecamatan" class="bg-white margin_btn" @input="getDesa" />

            <!-- DESA -->
            <span class="h_lable">Desa</span>
            <q-select v-model="form.desa_id" :options="list_desa" option-value="des_kel_id" option-label="nama_des_kel"
              emit-value map-options outlined square dense use-input fill-input hide-selected input-debounce="0"
              @filter="filterDesa" class="bg-white margin_btn" />


            <!-- ALAMAT -->
            <span class="h_lable">Alamat Lengkap</span>
            <q-input v-model="form.alamat" type="textarea" outlined square :dense="true" class="bg-white margin_btn" />

            <!-- FILE UPLOAD -->

            <span class="h_lable">Foto Kegiatan</span>
            <q-file v-model="form.file" label="Pilih File" accept="image/*" outlined square dense required
              class="bg-white margin_btn" :rules="[
              val => !!val || 'Foto kegiatan wajib diisi',
              val => !val || (['image/jpeg', 'image/png', 'image/jpg'].includes(val.type)) || 'Hanya file JPG/PNG yang diperbolehkan'
            ]" />



            <!-- 🔥 FILE SPESIFIKASI (PDF) -->
            <span class="h_lable">Lampiran Spesifikasi (PDF)</span>
            <q-file v-model="form.file_spec" label="Pilih PDF" accept=".pdf,application/pdf" outlined square dense
              class="bg-white margin_btn" />


            <hr class="hrpagin2">

          </q-card-section>

          <q-card-actions class="bg-grey-4 mdl-footer" align="right">
            <q-btn :loading="btn_add" color="primary" type="submit" label="Simpan" />
            <q-btn label="Batal" color="negative" v-close-popup />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
    <!-- ===================== MODAL ADD KEGIATAN CSR ===================== -->

    <!-- ===================== MODAL EDIT KEGIATAN CSR ===================== -->
    <q-dialog v-model="mdl_edit" persistent>
      <q-card class="mdl-md">
        <q-card-section class="bg-orange text-white">
          <div class="text-h6 h_modalhead">Edit Kegiatan CSR</div>
        </q-card-section>

        <form @submit.prevent="editData()">

          <q-card-section class="q-pt-none">

            <hr class="hrpagin2">

            <!-- BIDANG CSR -->
            <span class="h_lable">Bidang CSR</span>
            <q-select v-model="form.bidang_csr_id" :options="list_bidang" option-value="id" option-label="uraian"
              emit-value map-options outlined square dense class="bg-white margin_btn" @input="getSubBidang" />

            <!-- SUB BIDANG CSR -->
            <span class="h_lable">Sub Bidang CSR</span>
            <q-select v-model="form.bidang_sub_csr_id" :options="list_sub_bidang" option-value="id"
              option-label="uraian" emit-value map-options outlined square dense class="bg-white margin_btn" />

            <!-- NAMA CSR -->
            <span class="h_lable">Nama CSR</span>
            <q-input v-model="form.nama_csr" outlined square :dense="true" class="bg-white margin_btn" />

            <!-- DESKRIPSI CSR -->
            <span class="h_lable">Deskripsi / Keterangan CSR</span>
            <q-input v-model="form.deskripsi" type="textarea" outlined square :dense="true"
              class="bg-white margin_btn" />

            <!-- JUMLAH KEBUTUHAN -->
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <span class="h_lable">Jumlah</span>
                <q-input v-model="form.jumlah" type="number" outlined square :dense="true"
                  class="bg-white margin_btn" />
              </div>
              <div class="col-4">
                <span class="h_lable">Satuan</span>
                <q-input v-model="form.satuan" outlined square :dense="true" class="bg-white margin_btn" />
              </div>
              <div class="col-4">
                <span class="h_lable">Nilai Perkiraan</span>
                <q-input v-model="form.nilai" type="number" outlined square :dense="true" class="bg-white margin_btn" />
              </div>
            </div>

            <!-- TANGGAL MULAI & SELESAI -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <span class="h_lable">Tanggal Mulai</span>
                <q-input v-model="form.tanggal_mulai" type="date" outlined square :dense="true"
                  class="bg-white margin_btn" />
              </div>
              <div class="col-6">
                <span class="h_lable">Tanggal Selesai</span>
                <q-input v-model="form.tanggal_selesai" type="date" outlined square :dense="true"
                  class="bg-white margin_btn" />
              </div>
            </div>

            <!-- KECAMATAN -->
            <span class="h_lable">Kecamatan</span>
            <q-select v-model="form.kecamatan_id" :options="list_kecamatan" option-value="kecamatan_id"
              option-label="nama_kecamatan" emit-value map-options outlined square dense use-input fill-input
              hide-selected input-debounce="0" @filter="filterKecamatan" class="bg-white margin_btn" @input="getDesa" />

            <!-- DESA -->
            <span class="h_lable">Desa</span>
            <q-select v-model="form.desa_id" :options="list_desa" option-value="des_kel_id" option-label="nama_des_kel"
              emit-value map-options outlined square dense use-input fill-input hide-selected input-debounce="0"
              class="bg-white margin_btn" />

            <!-- ALAMAT -->
            <span class="h_lable">Alamat Lengkap</span>
            <q-input v-model="form.alamat" type="textarea" outlined square :dense="true" class="bg-white margin_btn" />

            <!-- FILE UPLOAD -->
            <span class="h_lable">Foto Kegiatan</span>
            <q-file v-model="form.file" label="Pilih File" outlined square dense class="bg-white margin_btn" />
            <div class="row items-center">

              <div :class="selectedItem.file_spec ? 'col-7' : 'col-12'">
                <span class="h_lable">Lampiran Spesifikasi (PDF)</span>
                <q-file v-model="form.file_spec" label="Ganti PDF (opsional)" accept=".pdf,application/pdf" outlined
                  square dense class="bg-white margin_btn" />
              </div>

              <div class="col-1"> </div>


              <div class="col-4" v-if="selectedItem.file_spec">
                <q-btn outline color="primary" icon="picture_as_pdf" class="q-mt-md" label="Lihat PDF"
                  @click="downloadFile(selectedItem.file_spec)" />
              </div>
            </div>


            <hr class="hrpagin2">
          </q-card-section>

          <q-card-actions class="bg-grey-4 mdl-footer" align="right">
            <q-btn color="warning" type="submit" label="Simpan Perubahan" />
            <q-btn label="Batal" color="negative" v-close-popup />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
    <!-- ===================== MODAL EDIT KEGIATAN CSR ===================== -->


    <!-- ===================== MODAL LIHAT DETIL KEGIATAN CSR ===================== -->
    <q-dialog v-model="mdl_lihat" persistent>
      <q-card class="mdl-md">

        <!-- Header -->
        <q-card-section class="main2 text-white flex items-center">
          <q-icon name="visibility" size="md" class="q-mr-sm" />
          <div class="text-h6">Detil Kegiatan CSR</div>
        </q-card-section>

        <q-separator />

        <!-- Body -->
        <q-card-section class="q-gutter-md">

          <!-- Lampiran File -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📂 Foto Kegiatan</div>
            <div v-if="selectedItem.file_name">
              <q-img :src="file_path + selectedItem.file_name" spinner-color="primary"
                style="max-height: 400px; cursor: pointer; border: 1px solid #ddd; border-radius: 6px;"
                @click="downloadFile(selectedItem.file_name)" />
            </div>
            <div v-else>
              <span class="text-grey">Tidak ada file</span>
            </div>
          </div>


          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📑 Lampiran Spesifikasi</div>
            <div v-if="selectedItem.file_spec">
              <q-btn color="primary" icon="picture_as_pdf" label="Lihat Spesifikasi"
                @click="downloadFile(selectedItem.file_spec)" />
            </div>
            <div v-else>
              <span class="text-grey">Tidak ada file spesifikasi</span>
            </div>
          </div>



          <!-- Informasi Program -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📌 Informasi Program</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Bidang</b></q-item-section>
                <q-item-section>{{ selectedItem.uraian_bidang_csr }}</q-item-section>
              </q-item>
              <q-item v-if="selectedItem.uraian_bidang_sub_csr">
                <q-item-section class="col-3 text-weight-medium"><b>Sub Bidang</b></q-item-section>
                <q-item-section>{{ selectedItem.uraian_bidang_sub_csr }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Nama CSR</b></q-item-section>
                <q-item-section>{{ selectedItem.nama_csr }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Jumlah Kebutuhan / Nilai</b></q-item-section>
                <q-item-section>
                  {{ selectedItem.jumlah }} {{ selectedItem.satuan }} -
                  Rp {{ Number(selectedItem.nilai).toLocaleString('id-ID') }} / {{ selectedItem.satuan }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Pelaksanaan Program -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">🗓️ Pelaksanaan Program</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Mulai</b></q-item-section>
                <q-item-section>{{ UMUM.tglConvert(selectedItem.tanggal_mulai) }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Selesai</b></q-item-section>
                <q-item-section>{{ UMUM.tglConvert(selectedItem.tanggal_selesai) }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Status Program -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📊 Status Program</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Status</b></q-item-section>
                <q-item-section>
                  <q-badge v-if="selectedItem.status == 1" color="orange" label="Program CSR Baru" />
                  <q-badge v-else-if="selectedItem.status == 2" color="yellow" text-color="black"
                    label="Dalam Pengerjaan" />
                  <q-badge v-else-if="selectedItem.status == 3" color="deep-purple-5" text-color="white"
                    label="Pengerjaan Sebagian" />
                  <q-badge v-else-if="selectedItem.status == 4" color="green-6" text-color="white" label="Selesai" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Total</b></q-item-section>
                <q-item-section>{{ selectedItem.jumlah }} {{ selectedItem.satuan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Terambil</b></q-item-section>
                <q-item-section>{{ (selectedItem.jumlah - selectedItem.jumlah_sisa) }} {{ selectedItem.satuan
                  }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Tersedia</b></q-item-section>
                <q-item-section>
                  {{ selectedItem.jumlah_sisa }} {{ selectedItem.satuan }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>


          <!-- Deskripsi -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📝 Deskripsi Program</div>
            <q-card flat bordered class="q-pa-sm text-grey-9">
              {{ selectedItem.deskripsi || 'Tidak ada deskripsi' }}
            </q-card>
          </div>

          <!-- Alamat -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📍 Lokasi Program</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Kecamatan</b></q-item-section>
                <q-item-section>{{ selectedItem.nama_kecamatan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Desa</b></q-item-section>
                <q-item-section>{{ selectedItem.nama_desa }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Alamat</b></q-item-section>
                <q-item-section>{{ selectedItem.alamat }}</q-item-section>
              </q-item>
            </q-list>
          </div>

        </q-card-section>

        <!-- Footer -->
        <q-separator />
        <q-card-actions class="bg-grey-3" align="right">
          <q-btn label="Tutup" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ===================== MODAL LIHAT DETIL KEGIATAN CSR ===================== -->




    <q-dialog v-model="mdlAmbil" persistent>
      <q-card class="mdl-md">

        <!-- Header -->
        <q-card-section class="bg-orange-14 text-white flex items-center">
          <q-icon name="gavel" size="md" class="q-mr-sm" />
          <div class="text-h6">Ambil Program CSR</div>
        </q-card-section>

        <q-separator />

        <!-- Konten -->
        <q-card-section class="q-gutter-md">

          <!-- Info Program -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">📌 Informasi Program</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"> <b>Nama</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.nama_csr }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Bidang</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.uraian_bidang_csr }}</q-item-section>
              </q-item>
              <q-item v-if="selectedProgram.uraian_bidang_sub_csr">
                <q-item-section class="col-3 text-weight-medium"><b>Sub Bidang</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.uraian_bidang_sub_csr }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Jumlah Tersedia</b></q-item-section>
                <q-item-section>
                  <q-badge color="orange-14" text-color="black" style="font-weight: bolder; font-size: larger;"
                    :label="selectedProgram.jumlah_sisa + ' ' + selectedProgram.satuan" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Jumlah Total</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.jumlah }} {{ selectedProgram.satuan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Nilai Program</b></q-item-section>
                <q-item-section class="col-9">Rp {{ Number(selectedProgram.nilai).toLocaleString('id-ID') }} / {{
              selectedProgram.satuan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Mulai</b></q-item-section>
                <q-item-section class="col-9">{{ UMUM.tglConvert(selectedProgram.tanggal_mulai) }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Tanggal Selesai</b></q-item-section>
                <q-item-section class="col-9">{{ UMUM.tglConvert(selectedProgram.tanggal_selesai) }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Alamat</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.alamat }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Kecamatan</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.nama_kecamatan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Desa</b></q-item-section>
                <q-item-section class="col-9">{{ selectedProgram.nama_desa }}</q-item-section>
              </q-item>
            </q-list>
          </div>


          <!-- Info Mitra -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">🏢 Informasi Perusahaan</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Nama Perusahaan</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.nama_perusahaan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Email Perusahaan</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.email_perusahaan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Telp Perusahaan</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.telp_perusahaan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Alamat Perusahaan</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.alamat_perusahaan }}</q-item-section>
              </q-item>
            </q-list>

            <q-separator spaced />

            <div class="text-subtitle2 text-bold q-mb-sm">👤 Penanggung Jawab</div>
            <q-list dense bordered separator class="rounded-borders">
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Nama</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.nama_pj }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Jabatan</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.jabatan }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>Email</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.email_pj }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="col-3 text-weight-medium"><b>No Hp</b></q-item-section>
                <q-item-section class="col-9">{{ mitra.hp_pj }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Ambil Program -->
          <div>
            <div class="text-subtitle1 text-bold q-mb-sm">⚖️ Jumlah Pnegambilan CSR</div>
            <q-toggle v-model="ambilSemua" label="Mengambil Seluruh Jumlah Kebutuhan CSR" color="amber"
              @update:model-value="onToggleSemua" />
            <q-input v-model.number="jumlahAmbil" type="number" outlined dense class="q-mt-sm"
              label="Jumlah yang ingin diambil" :disable="ambilSemua" :max="selectedProgram.jumlah_sisa" :rules="[
              val => val > 0 || 'Minimal 1',
              val => val <= selectedProgram.jumlah_sisa || 'Tidak boleh lebih dari sisa'
            ]" />

            <!-- Catatan -->
            <q-input v-model="catatanAmbil" type="textarea" outlined autogrow class="q-mt-md"
              label="Catatan (opsional)" />
          </div>

        </q-card-section>

        <q-separator />

        <!-- Actions -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Batal" color="negative" v-close-popup />
          <q-btn label="Kirim Pengajuan" color="orange-14" text-color="white" @click="submitAmbil" glossy />
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






  </div>
</template>


<script>

import UMUM from "../../library/umum.js";
export default {
  data() {
    return {
      UMUM: UMUM,
      btn_add: false,
      mdl_add: false,
      mdl_edit: false,
      mdl_delete: false,
      alert: false,
      mdl_lihat: false,
      selectedItem: {},
      cari_value: "",
      page_first: 1,
      page_last: 1,
      page_limit: 9,
      total: 0,
      mdlAmbil: false,
      selectedProgram: {},
      jumlahAmbil: 0,
      ambilSemua: false,
      catatanAmbil: '',

      tipe: null, // simpan tipe user


      form: {
        bidang_csr_id: null,
        bidang_sub_csr_id: null,
        nama_csr: "",
        deskripsi: "",
        jumlah: "",
        satuan: "",
        nilai: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        kecamatan_id: "",
        desa_id: "",
        alamat: "",
        file_name: null,   // (lama)
        file: null,        // (lama, lampiran gambar/foto)
        file_spec: null    // 🔥 BARU: lampiran spesifikasi (PDF)
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
      listCSR: [],
      file_path: this.$store.state.url.URL_APP + "uploads/",


      filterku: {
        kecamatan_id: "",
        desa_id: "",
        bidang_csr_id: "",
        bidang_sub_csr_id: "",
        status: ""
      },


      list_sub_bidang_filter: [],

      // hasil data yang difilter
      dataView: [],

      list_desa_filter: [],

      statusOptions: [
        { label: 'Semua Status', value: '' },
        { label: 'Program CSR Baru', value: 1 },
        { label: 'Dalam Pengerjaan', value: 2 },
        { label: 'Pengerjaan Sebagian', value: 3 },
        { label: 'Selesai', value: 4 }
      ],

      kecamatanOptions: [],
      bidangOptions: [] // <- ubah dari computed ke data

    }


  },


  methods: {

    ambilProgram(item) {
      this.selectedProgram = item
      this.ambilSemua = false
      this.jumlahAmbil = item.jumlah_sisa
      this.catatanAmbil = `Kami akan mengambil program CSR ${item.nama_csr}, mohon untuk segera ditindaklanjuti. Terima kasih.`
      this.mdlAmbil = true

      const profile = JSON.parse(localStorage.profile)
      const userId = profile._id
      this.getMitra(userId)
    },
    onToggleSemua(val) {
      if (val) {
        this.jumlahAmbil = this.selectedProgram.jumlah_sisa
      }
    },

    onChangeDesa(val) {
      this.filterku.desa_id = val;
      this.getView();
    },

    onStatusChange(val) {
      this.getView()
    },


    onChangeBidang(val) {
      this.filterku.bidang_sub_csr_id = "";
      this.getSubBidangFilter(val);
      this.getView();
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

    onItemClick(item, action) {
      this.selectedItem = item;

      if (action === "edit") {
        this.openEditModal(item);
      } else if (action === "lihat") {
        this.mdl_lihat = true;
      } else if (action === "delete") {
        this.form.id = item.id;
        this.mdl_delete = true;
      }

    },


    formatDateForInput(raw) {
      if (!raw) return "";
      const s = String(raw);
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const d = new Date(s);
      if (isNaN(d)) return s.slice(0, 10);
      const ms = d.getTime() - d.getTimezoneOffset() * 60000;
      return new Date(ms).toISOString().slice(0, 10);
    },


    downloadFile(fileName) {
      if (fileName) {
        window.open(this.file_path + fileName, "_blank");
      }
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

    submitAmbil() {
      if (!this.jumlahAmbil || this.jumlahAmbil <= 0) {
        this.Notify("Jumlah yang diambil harus lebih dari 0", "negative", "error_outline");
        return;
      }

      const profile = JSON.parse(localStorage.profile);

      const payload = {
        kegiatan_id: this.selectedProgram.id,
        perusahaan_id: profile._id, // ambil user login
        jumlah_ambil: this.jumlahAmbil,
        catatan_mitra: this.catatanAmbil
      };

      fetch(this.$store.state.url.KEGIATAN_CSR + "addPengajuan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(res_data => {
          if (res_data.success) {
            this.Notify("Pengajuan berhasil dikirim", "primary", "check_circle_outline");
            this.mdlAmbil = false;
            this.getView();
          } else {
            this.Notify("Gagal mengirim pengajuan", "negative", "error_outline");
          }
        })
        .catch(err => {
          console.error("❌ Error:", err);
          this.Notify("Terjadi kesalahan server", "negative", "error_outline");
        });
    },


    async getSubBidang(presetId) {

      this.form.bidang_sub_csr_id = null;
      this.list_sub_bidang = [];


      if (!this.form.bidang_csr_id) return;

      const res = await fetch(this.$store.state.url.URL_DM_BID + "sub_bidang", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ bidang_csr_id: this.form.bidang_csr_id })
      });

      const rows = await res.json();


      this.list_sub_bidang = (rows || []).map(sb => ({
        ...sb,
        id: String(sb.id)
      }));


      if (presetId != null) {
        const val = String(presetId);
        if (this.list_sub_bidang.some(sb => sb.id === val)) {
          this.form.bidang_sub_csr_id = val;
        }
      }

    },

    getKecamatan() {
      fetch(this.$store.state.url.KEGIATAN_CSR + "kecamatan", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        }
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_kecamatan = res_data.map(k => ({
            ...k,
            kecamatan_id: String(k.kecamatan_id)
          }));
          this.list_kecamatan_master = this.list_kecamatan;
        })
    },

    filterKecamatan(val, update) {
      if (val === '') {
        update(() => {
          this.list_kecamatan = this.list_kecamatan_master
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.list_kecamatan = this.list_kecamatan_master.filter(v =>
          v.nama_kecamatan.toLowerCase().includes(needle)
        )
      })
    },

    getDesa() {
      this.form.desa_id = ""
      this.list_desa = []
      this.list_desa_master = []

      fetch(this.$store.state.url.KEGIATAN_CSR + "desa", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({
          kecamatan_id: this.form.kecamatan_id
        })
      })
        .then(res => res.json())
        .then(res_data => {
          // paksa id -> string
          this.list_desa = res_data.map(d => ({
            ...d,
            des_kel_id: String(d.des_kel_id)
          }));
          this.list_desa_master = this.list_desa;
        });
    },

    filterDesa(val, update) {
      if (val === '') {
        update(() => {
          this.list_desa = this.list_desa_master
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.list_desa = this.list_desa_master.filter(v =>
          v.nama_des_kel.toLowerCase().includes(needle)
        )
      })
    },


    addData() {
      this.btn_add = true;

      const formData = new FormData();

      for (let key in this.form) {
        if ((key === "file" || key === "file_spec") && this.form[key]) {
          formData.append(key, this.form[key]);
        } else if (key !== "file" && key !== "file_spec") {
          formData.append(key, this.form[key]);
        }
      }

      fetch(this.$store.state.url.KEGIATAN_CSR + "addData", {
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
            this.Notify("Gagal Menambah Data", "negative", "error_outline");
          }
        })
        .catch(err => {
          this.btn_add = false;
          console.error("❌ Error:", err);
          this.Notify("Terjadi kesalahan server", "negative", "error_outline");
        });
    },
    resetForm() {
      this.form = {
        bidang_csr_id: null,
        bidang_sub_csr_id: null,
        nama_csr: "",
        deskripsi: "",
        jumlah: null,
        satuan: "",
        nilai: null,
        tanggal_mulai: "",
        tanggal_selesai: "",
        kecamatan_id: "",
        desa_id: "",
        alamat: ""
      }
    },


    editData() {
      if (!this.form.id) {
        this.Notify("ID data tidak ditemukan", "negative", "error_outline");
        return;
      }

      this.btn_add = true;

      const formData = new FormData();

      formData.append("id", this.form.id);
      for (let key in this.form) {
        if ((key === "file" || key === "file_spec") && this.form[key]) {
          formData.append(key, this.form[key]);
        } else if (!["file", "file_spec", "id"].includes(key)) {
          formData.append(key, this.form[key] ?? "");
        }
      }

      fetch(this.$store.state.url.KEGIATAN_CSR + "editData", {
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
            this.Notify("Sukses Mengubah Data", "primary", "check_circle_outline");
            this.mdl_edit = false;   // tutup modal edit (bukan add)
            this.getView();
          } else {
            this.Notify(res_data.message || "Gagal Mengubah Data", "negative", "error_outline");
          }
        })
        .catch(err => {
          this.btn_add = false;
          console.error("❌ Error editData:", err);
          this.Notify("Terjadi kesalahan server", "negative", "error_outline");
        });
    },


    getView() {
      this.$store.commit("shoWLoading")
      fetch(this.$store.state.url.KEGIATAN_CSR + "viewData", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({
          ...this.filterku,
          data_ke: this.page_first,
          cari_value: this.cari_value,
          page_limit: this.page_limit
        })
      })
        .then(res => res.json())
        .then(res_data => {
          this.dataView = res_data.data
          this.total = res_data.total;
          this.page_last = Math.ceil(this.total / this.page_limit);
          this.$store.commit("hideLoading")
        })
        .catch(err => {
          console.error("❌ Error getView:", err)
          this.$store.commit("hideLoading")
        })
    },

    removeData: function () {
      const base = this.$store.state.url.KEGIATAN_CSR || '';
      const url = base.replace(/\/?$/, '/') + 'removeData';

      const payload = { id: this.form.id };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "kikensbatara " + localStorage.token
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          const text = await res.text();
          let data; try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
          if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
          return data;
        })
        .then((res_data) => {
          if (res_data?.success) {
            this.Notify(res_data.message || 'Sukses Menghapus Data', 'positive', 'check_circle_outline');
            this.getView();
          } else {
            this.Notify(res_data?.message || 'Gagal Menghapus Data', 'warning', 'error');
          }
        })
        .catch((err) => {
          this.Notify('Gagal menghapus: ' + (err.message || 'Unknown error'), 'warning', 'error');
        });
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

    getKecamatanFilter() {
      fetch(this.$store.state.url.KEGIATAN_CSR + "kecamatan", {
        headers: {
          authorization: "kikensbatara " + localStorage.token
        }
      })
        .then(res => res.json())
        .then(res_data => {
          this.kecamatanOptions = [
            { kecamatan_id: "", nama_kecamatan: "-- SEMUA KECAMATAN --" },
            ...res_data.map(k => ({
              ...k,
              kecamatan_id: k.kecamatan_id.toString()
            }))
          ];
        })
        .catch(err => console.error("❌ Error fetch kecamatan:", err));
    },


    onChangeKecamatanFilter(val) {
      this.filterku.kecamatan_id = val;
      this.filterku.desa_id = "";
      this.getDesaFilter();
      this.getView();
    },


    getDesaFilter() {
      if (!this.filterku.kecamatan_id) {
        this.list_desa_filter = []
        return
      }

      fetch(this.$store.state.url.KEGIATAN_CSR + "desa", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({
          kecamatan_id: this.filterku.kecamatan_id
        })
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_desa_filter = res_data
        })
        .catch(err => {
          console.error("Error fetch desa:", err)
        })
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



    cari_data() {
      this.page_first = 1;
      this.getView();
    },


    async openEditModal(item) {
      this.selectedItem = item;


      this.form = {
        ...this.form,
        id: item.id,
        bidang_csr_id: item.bidang_csr_id ? String(item.bidang_csr_id) : null,
        bidang_sub_csr_id: item.bidang_sub_csr_id ? String(item.bidang_sub_csr_id) : null,
        nama_csr: item.nama_csr || "",
        deskripsi: item.deskripsi || "",
        jumlah: item.jumlah ?? null,
        satuan: item.satuan || "",
        nilai: item.nilai ?? null,
        tanggal_mulai: this.formatDateForInput(item.tanggal_mulai),
        tanggal_selesai: this.formatDateForInput(item.tanggal_selesai),
        kecamatan_id: item.kecamatan_id ? String(item.kecamatan_id) : null,
        desa_id: item.desa_id ? String(item.desa_id) : "",
        alamat: item.alamat || "",
        file: null,
        file_name: item.file_name || null
      };


      if (this.form.bidang_csr_id) {
        await this.getSubBidang(this.form.bidang_sub_csr_id);
      } else {
        this.list_sub_bidang = [];
      }


      await this.getDesaEdit(this.form.kecamatan_id, this.form.desa_id);


      this.mdl_edit = true;
    },

    getDesaEdit(kecamatan_id, presetDesaId) {
      this.form.desa_id = "";
      this.list_desa = [];
      this.list_desa_master = [];
      if (!kecamatan_id) return Promise.resolve();

      return fetch(this.$store.state.url.KEGIATAN_CSR + "desa", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
        },
        body: JSON.stringify({ kecamatan_id })
      })
        .then(res => res.json())
        .then(res_data => {
          this.list_desa = res_data.map(d => ({
            ...d,
            des_kel_id: String(d.des_kel_id)
          }));
          this.list_desa_master = this.list_desa;
          if (presetDesaId) this.form.desa_id = presetDesaId;
        });
    },



  },
  mounted() {

    const get_profile = JSON.parse(localStorage.profile);
    this.tipe = Number(get_profile.profile.db_csrkonsel);


    this.mitra = {
      id: get_profile._id,
      nama: get_profile.profile.nama,
      username: get_profile.username
    }
    this.getView();
    this.getKecamatan();
    this.getKecamatanFilter();
    this.getBidang();
    this.getBidangFilter();

  }
}
</script>
