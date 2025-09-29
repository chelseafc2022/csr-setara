<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <!-- Header -->
      <q-card-section class="main2 text-white">
        <div class="text-h6 h_titleHead">DASHBOARD</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section class="biruSangatmudaGrad">
        <div class="row q-col-gutter-md items-start">
          <div class="col-12 col-md-12 column">
            <!-- Widget Status -->
            <div class="row q-col-gutter-md">
              <!-- Total Kegiatan -->
              <div class="col-12 col-md-5th">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center main1x row items-center justify-center">
                    <q-icon name="view_list" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 main1">
                    <span class="frWidgetText1">Total Kegiatan</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.total_kegiatan }}</span>
                  </div>
                </div>
              </div>

              <!-- CSR Baru -->
              <div class="col-12 col-md-5th">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardCSR row items-center justify-center">
                    <q-icon name="fiber_new" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardCSRNilai">
                    <span class="frWidgetText1">CSR Baru</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.csr_baru }}</span>
                  </div>
                </div>
              </div>

              <!-- Dalam Pengerjaan -->
              <div class="col-12 col-md-5th">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardProsesIcon row items-center justify-center">
                    <q-icon name="hourglass_top" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardProsesNilai">
                    <span class="frWidgetText1">Pengerjaan</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.dalam_pengerjaan }}</span>
                  </div>
                </div>
              </div>

              <!-- Pengerjaan Sebagian -->
              <div class="col-12 col-md-5th">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardSebagian row items-center justify-center">
                    <q-icon name="construction" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardSebagianNilai">
                    <span class="frWidgetText1">Sebagian</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.pengerjaan_sebagian }}</span>
                  </div>
                </div>
              </div>

              <!-- Selesai -->
              <div class="col-12 col-md-5th">
                <div class="row shadow-3 frWidgetSub" style="min-height:80px">
                  <div class="col-4 frWidgetSub1 text-center widgetdashboardTerimaIcon row items-center justify-center">
                    <q-icon name="check_circle_outline" size="28px" color="white" />
                  </div>
                  <div class="col-8 frWidgetSub2 widgetdashboardTerimaNilai">
                    <span class="frWidgetText1">Selesai</span><br>
                    <span class="frWidgetText2">{{ widgetStatus.selesai }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>





        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <div class="frameChart shadow-5">
              <div id="chartPieCSR" style="width:100%; height:400px;"></div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="frameChart shadow-5">
              <div id="chartByBidangCSR" style="width:100%; height:400px;"></div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="frameChart shadow-5 q-pa-md">
              <div class="text-h6 q-mb-md">Jumlah Partisipasi Perusahaan/Mitra</div>
              <table style="width:100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #e3f2fd;">
                    <th style="text-align:left; padding: 8px;">Perusahaan/Mitra</th>
                    <th style="text-align:right; padding: 8px;">Jumlah Partisipasi Program</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in listPerusahaan" :key="item.nama_perusahaan"
                    :style="{ backgroundColor: listPerusahaan.indexOf(item) % 2 === 0 ? '#f9f9f9' : 'white' }">
                    <td style="padding: 8px;">{{ item.nama_perusahaan }}</td>
                    <td style="padding: 8px; text-align:right;">{{ item.jumlah }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
          <div class="col-12 col-md-6">
            <div class="frameChart shadow-5 q-pa-md">
              <div class="text-h6 q-mb-md">Jumlah Bidang Usaha Perusahaan/Mitra</div>
              <table style="width:100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #e3f2fd;">
                    <th style="text-align:left; padding: 8px;">Bidang Usaha</th>
                    <th style="text-align:right; padding: 8px;">Jumlah Perusahaan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in listBidangUsaha" :key="item.bidang_id"
                    :style="{ backgroundColor: listBidangUsaha.indexOf(item) % 2 === 0 ? '#f9f9f9' : 'white' }">
                    <td style="padding: 8px;">{{ item.nama_bidang }}</td>
                    <td style="padding: 8px; text-align:right;">{{ item.jumlah }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>




        </div>

      </q-card-section>
      <q-card-section class="biruSangatmudaGrad">


      </q-card-section>
    </q-card>


  </div>
</template>

<script>
export default {
  data() {
    return {
      bidangCSRChart: [],  // data dari backend
      bidangCSR: [],
      mitra: null,
      tipe: null,
      perusahaan: null,
      indikator: {
        pengajuan: 12,
        diterima: 7,
        ditolak: 3,
        proses: 2
      },

      widgetStatus: {
        total_kegiatan: 0,
        csr_baru: 0,
        dalam_pengerjaan: 0,
        pengerjaan_sebagian: 0,
        selesai: 0
      },
      listPerusahaan: [], // data dari backend
      listBidangUsaha: [], // data dari backend
      columnsPerusahaan: [
        { name: 'nama_perusahaan', label: 'Perusahaan', align: 'left', field: row => row.nama_perusahaan },
        { name: 'jumlah', label: 'Jumlah Partisipasi', align: 'right', field: row => row.jumlah }
      ],

    }
  },
  mounted() {
    const get_profile = JSON.parse(localStorage.profile);

    this.tipe = Number(get_profile.profile.db_csrkonsel);

    this.mitra = {
      id: get_profile._id,
      nama: get_profile.profile.nama,
      username: get_profile.username,
      email: get_profile.email,
      telp: get_profile.profile.telp,
      alamat: get_profile.profile.alamat,
      pic: get_profile.profile.pic,
      file_name: get_profile.profile.file_name // logo perusahaan
    };

    // this.getMitra(get_profile._id);

    this.loadWidgetAdmin();
    this.loadPerusahaan(); // panggil load data perusahaan
    this.loadBidangUsaha(); // panggil load data perusahaan
    this.getBidangCSR(); // panggil load data perusahaan
  },
  methods: {

    async loadPerusahaan() {
      try {
        const res = await fetch(this.$store.state.url.DASHBOARD + 'perusahaanPartisipasi', {
          headers: { authorization: 'kikensbatara ' + localStorage.token }
        });
        const data = await res.json();
        if (data.data) this.listPerusahaan = data.data;
        console.log('Perusahaan Partisipasi:', data.data);
      } catch (err) {
        console.error('Gagal ambil data perusahaan:', err);
      }
    },

    async loadBidangUsaha() {
      try {
        const res = await fetch(this.$store.state.url.DASHBOARD + 'bidangUsaha', {
          headers: { authorization: 'kikensbatara ' + localStorage.token }
        });


        const data = await res.json();

        if (data.data) {
          this.listBidangUsaha = data.data;

        } else {
          console.warn('Backend tidak mengirim data bidang usaha');
        }

      } catch (err) {
        console.error('Gagal ambil data bidang usaha:', err);
      }
    },

    async loadWidgetAdmin() {
      try {
        const res = await fetch(this.$store.state.url.DASHBOARD + "statusAdmin", {
          headers: {
            "authorization": "kikensbatara " + localStorage.token
          }
        });
        const data = await res.json();
        if (data.data) this.widgetStatus = data.data;
        this.$nextTick(() => {
          this.chartPieCSR(); // render chart setelah widgetStatus terisi
        });
        console.log(data);
      } catch (err) {
        console.error('Gagal ambil widget admin:', err);
      }
    },



    chartPieCSR() {
      Highcharts.chart('chartPieCSR', {
        chart: { type: 'pie', backgroundColor: 'transparent' },
        title: { text: 'Status Program CSR' },
        tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: { enabled: false },
            showInLegend: true
          }
        },
        series: [{
          name: 'Persentase',
          colorByPoint: true,
          data: [
            { name: 'CSR Baru', y: this.widgetStatus.csr_baru, color: '#1e88e5' },
            { name: 'Dalam Pengerjaan', y: this.widgetStatus.dalam_pengerjaan, color: '#ffb300' },
            { name: 'Pengerjaan Sebagian', y: this.widgetStatus.pengerjaan_sebagian, color: '#f57c00' },
            { name: 'Selesai', y: this.widgetStatus.selesai, color: '#43a047' }
          ]
        }]
      });
    },
    getBidangCSR() {
      fetch(this.$store.state.url.DASHBOARD + "bidangCSR", {
        headers: {
          authorization: "kikensbatara " + localStorage.token
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.data) {
            this.bidangCSR = res.data;
            this.chartByBidangCSR();
          }
        })
        .catch(err => console.error(err));
    },


    chartByBidangCSR() {
      if (!this.bidangCSR || this.bidangCSR.length === 0) return;

      Highcharts.chart('chartByBidangCSR', {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'Pengajuan Berdasarkan Bidang CSR' },
        xAxis: {
          categories: this.bidangCSR.map(b => b.nama_bidang), // <-- ganti nama_bidang -> uraian
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: { text: 'Jumlah Pengajuan' }
        },
        tooltip: {
          shared: true,
          valueSuffix: ' pengajuan'
        },
        plotOptions: {
          column: { colorByPoint: true }
        },
        series: [{
          name: 'Jumlah Pengajuan',
          data: this.bidangCSR.map(b => b.total_pengajuan), // <-- ganti total_pengajuan -> total
          color: '#1e88e5'
        }]
      });
    },


  }
}
</script>
