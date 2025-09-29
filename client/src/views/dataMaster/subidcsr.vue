<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Sub Bidang Kegiatan</div>
            <!-- <div class="text-subtitle2">Program/Kegiatan</div> -->
          </div>
          <div class="col-12 col-md-2"></div>
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square :dense="true" class="bg-white" style="width:90%"/>
              <q-btn glossy class="main1" @click="mdl_add = true" dense flat icon="add" style="width:10%">
                  <q-tooltip content-class="bg-red-8" content-style="font-size: 13px">
                    Click untuk menambah data
                  </q-tooltip>
              </q-btn>
            </div>

          </div>
        </div>
      </q-card-section>

      <q-separator dark inset />


      <q-card-section>

          <hr class="hrpagin">


          <div class="row">
            <div class="col-12">
              <span class="h_lable">Bidang CSR</span>
              <select v-model="filterku.master_bidang_csr_id" @change="getView()" class="bg-white">
                <option value="">-- SEMUA BIDANG --</option>
                <option v-for="data in list_bidang" :key="data.id" :value="data.id">
                  🔹 {{ data.uraian }}
                </option>
              </select>
            </div>
          </div>


        <hr class="hrpagin2">


        <div class="tbl_responsive">
          <!-- =================================================== KONTENT =========================================================== -->
            <table width="100%">
              <tr class="h_table_head main1 text-white ">
                <th width="5%" class="text-center">No</th>
                <th width="40%">Sub Bidang CSR</th>
                <th width="10%"></th>
              </tr>
              <tr class="h_table_body" v-for="(data, index) in list_data" :key="data.id+'-'+index">
                  <td class="text-center">{{indexing(index+1)}}.</td>
                  <td>{{data.uraian}}</td>
                  <td class="text-center">
                      <q-btn-group>
                      <q-btn @click="mdl_hapus = true, selectData(data)" glossy color="negative" icon="delete_forever" class="tbl_btn">
                          <q-tooltip content-class="bg-red" content-style="font-size: 13px">
                          Click untuk menghapus data ini
                          </q-tooltip>
                      </q-btn>

                      <q-btn @click="selectData(data), mdl_edit = true" glossy color="orange" icon="create" class="tbl_btn">
                        <q-tooltip content-class="bg-orange-9" content-style="font-size: 13px">
                          Click untuk mengubah data ini
                        </q-tooltip>
                      </q-btn>
                      </q-btn-group>
                  </td>
              </tr>

            </table>

          <!-- =================================================== KONTENT =========================================================== -->
        </div>
        <hr class="hrpagin">
        <br>
        <div class="flex flex-center">
          <q-pagination
              @click="getView()"
              v-model="page_first"
              :max="page_last"
              :max-pages="4"
              color="grey-6"

              :direction-links="true"
              :boundary-links="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
          >
          </q-pagination>
        </div>




        <br>
      </q-card-section>
    </q-card>





          <!-- =================================================== MODAL =========================================================== -->


            <!-- ================================================= MODAL TAMBAH ================================================ -->
              <q-dialog v-model="mdl_add" persistent>
                <q-card class="mdl-md">
                  <q-card-section class="main1">
                    <div class="text-h6 h_modalhead">Tambah Program</div>
                  </q-card-section>

                  <form @submit.prevent="addData()">
                    <q-card-section class="q-pt-none">
                        <br>

                        <div class="row">

                  

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Bidang CSR</span>
                              <select v-model="form.master_bidang_csr_id" class="bg-white">
                                  <!-- <option value="">-- SEMUA KECAMATAN --</option> -->
                                  <!-- <option v-for="data in $store.state.list_kecamatan" :key="data.id" :value="data.kecamatan_id">🔹 {{ data.nama_kecamatan }}</option> -->
                                  <option v-for="(data) in list_bidang" :value="data.id">🔹 {{data.uraian}}</option>
                              </select>
                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Sub Bidang CSR</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
                          </div>

                        </div>

                    </q-card-section>

                    <q-card-actions class="bg-grey-4 mdl-footer" align="right">
                        <q-btn :loading="btn_add" color="primary" @click="addData()" label="Simpan" />
                        <q-btn label="Batal" color="negative" v-close-popup />
                    </q-card-actions>

                  </form>
                </q-card>
              </q-dialog>
            <!-- ================================================= MODAL TAMBAH ================================================ -->


            <!-- ================================================= MODAL EDIT ================================================ -->
                <q-dialog v-model="mdl_edit" persistent>
                <q-card class="mdl-md">
                  <q-card-section class="bg-orange">
                    <div class="text-h6 h_modalhead">Edit Data</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                        <br>
                        <div class="row">

                      
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Sub Bidang CSR</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
                          </div>

                        </div>
                  </q-card-section>

                  <q-card-actions class="bg-grey-4 mdl-footer" align="right">
                    
                      <q-btn :loading="btn_add" color="primary" @click="editData()" label="Simpan" />
                      <q-btn label="Batal" color="negative" v-close-popup />
              
                  </q-card-actions>
                </q-card>
              </q-dialog>
            <!-- ================================================= MODAL EDIT ================================================ -->

            <!-- ================================================ MODAL HAPUS ================================================ -->
              <q-dialog v-model="mdl_hapus" persistent>
                  <q-card class="mdl-sm ">
                  <q-card-section class="q-pt-none text-center orageGrad">
                      <form @submit.prevent="removeData">
                          <br>
                          <img src="img/alert.png" alt="" width="75"> <br>
                          <span class="h_notifikasi">APAKAH ANDA YAKIN INGIN MENGHAPUS DATA INI??</span>
                          <input type="submit" style="position: absolute; left: -9999px"/>
                          <br>
                          <br>

                          <q-btn label="Batal" size="sm" color="negative"  v-close-popup/>
                          &nbsp;
                          <q-btn type="submit" label="Hapus" size="sm" color="primary" v-close-popup/>

                      </form>
                  </q-card-section>
                  </q-card>
              </q-dialog>

            <!-- ================================================ MODAL HAPUS ================================================ -->




          <!-- =================================================== MODAL =========================================================== -->




  </div>
</template>
  
  
  <script>
  
  
  export default {
    data() {
      return {
  
        form: {
            id: '',
            master_bidang_csr_id: '',
            uraian: ''
          },

         filterku: {
          master_bidang_csr_id: ''  // filter pakai bidang csr
        },

        list_data : [],
        list_bidang : [],
  
        page_first: 1,
        page_last: 0,
        page_limit : 10,
        cari_value: "",
        cek_load_data : true,
  
        mdl_add: false,
        mdl_edit: false,
        mdl_hapus : false,
        btn_add: false,
  
      }
    },
    methods: {

      getBidang() {
        fetch(this.$store.state.url.URL_DM_BID + "viewBidang", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({})
        })
          .then(res => res.json())
          .then(res_data => {
            this.list_bidang = res_data.data; // hasil dari master_bidang_csr
          });
      },
  
        getView() {
          fetch(this.$store.state.url.URL_DM_BID + "viewSubid", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({
              data_ke: this.page_first,
              cari_value: this.cari_value,
              page_limit: this.page_limit,
              master_bidang_csr_id: this.filterku.master_bidang_csr_id
            })
          })
            .then(res => res.json())
            .then(res_data => {
              this.list_data = res_data.data;
              this.page_last = res_data.jml_data;
            });
        },
  
  
        addData() {
          fetch(this.$store.state.url.URL_DM_BID + "addSubid", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify({ form: this.form })
          }).then(() => {
            this.Notify("Sukses Menambah Data", "primary", "check_circle_outline");
            this.getView();
          });
        },
  
  
      editData : function(){
        fetch(this.$store.state.url.URL_DM_BID + "editSubid", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify(this.form)
        }).then(res_data => {
            this.Notify('Sukses Merubah Data', 'warning', 'check_circle_outline');
            this.getView();
        });
      },
  
      removeData : function(E){
        fetch(this.$store.state.url.URL_DM_BID + "removeSubid", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "kikensbatara " + localStorage.token
            },
            body: JSON.stringify(this.form)
        }).then(res_data => {
            this.Notify('Sukses Menghapus Data', 'negative', 'check_circle_outline');
            this.getView();
        });
  
      },
  
      selectData : function(data){

        console.log(data);
          this.form.id = data.id;
          this.form.program_id = data.program_id;
          this.form.tahun = data.tahun;
          this.form.uraian = data.uraian;
          this.form.keterangan = data.keterangan;
          this.form.des_kel_id = data.des_kel_id;
          this.form.nama_des_kel = data.nama_des_kel;
      },
  
  
      // ====================================== CONTOH eDOC ====================================
      async onChangexKecamatan(){
        
        
        await DATAMASTER.getKecamatanAsync("");
        this.onChangexDeskel();
      },
      async onChangexDeskel(){
        // console.log("yyyyyyyyyyyy");
        var deskelx = await DATAMASTER.getDeskelAsync(this.filterku.kecamatan_id)
        // console.log("xxxxxxxxxxxxx");
        console.log(deskelx[0].id);
      
          // this.filterku.des_kel_id = deskelx[0].id
        
        
        // console.log("xxxxxxxxxxxxx");
        console.log(this.filterku.des_kel_id);
        this.getView();
      },

      // ====================================== PAGINATE ====================================
          Notify : function(message, positive, icon){
            this.$q.notify({
              message: message,
              color: positive,
              icon: icon,
              position : 'top',
              timeout: 500,
            })
          },
          btn_prev : function(){
              this.cek_load_data = true;
              if(this.page_first>1){
                  this.page_first--
              }else{
                  this.page_first = 1;
              }
              this.getView();
          },
  
          btn_next : function(){
              if(this.page_first >= this.page_last){
                  this.page_first == this.page_last
              }else{
                  this.page_first++;
              }
              this.getView();
          },
  
          cari_data : function(){
              this.page_first = 1;
              this.getView();
          },

            indexing : function(index){
                var idx = ((this.page_first-1)*this.page_limit)+index
                return idx
            },
  
  
      // ====================================== PAGINATE ====================================
  
  
  
  
  
  
  
    },
  
    mounted () {

      this.getBidang();
    this.getView(); // load awal (semua sub bidang)

    },
  }
  </script>
  
  
  
  
   