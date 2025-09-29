<template>
  <div class="about" style="padding:15px">
    <q-card bordered class="my-card">
      <q-card-section class="main2 text-white">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="text-h6 h_titleHead">Usulan Lokasi Absen</div>
            <div class="text-subtitle2">Verikasi Lokasi</div>
          </div>
          <div class="col-12 col-md-2"></div>
          <div class="col-12 col-md-4">
            <div class="row">
              <q-input v-model="cari_value" @keyup="cari_data()" outlined square :dense="true" class="bg-white" style="width:90%"/>
              <q-btn glossy class="bg-light-blue-10" @click="mdl_add = true" dense flat icon="add" style="width:10%">
                  <q-tooltip content-class="bg-light-blue-10" content-style="font-size: 13px">
                    Click untuk menambah data
                  </q-tooltip>
              </q-btn>
            </div>

          </div>
        </div>
      </q-card-section>

      <q-separator dark inset />


      <q-card-section>


        <div class="row">
          <div class="col-12 col-md-6 rowLeft">
            <span class="h_lable ">Side Kiri</span>
            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
          </div>

          <div class="col-12 col-md-6 rowRight">
            <span class="h_lable ">Side Kanan</span>
            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
          </div>
        </div>


        <hr class="hrpagin2">


        <div class="tbl_responsive">
          <!-- =================================================== KONTENT =========================================================== -->
            <table width="100%">
              <tr class="h_table_head bg-blue-2">
                <th width="5%" class="text-center">No</th>
                <th width="20%">Nama/NIP</th>
                <th width="25%">Instansi</th>
                <th width="25%">Keterangan</th>
                <th width="5%">Status</th>
                <th width="10%"></th>
              </tr>
              <tr class="h_table_body">
                <td class="text-center">1.</td>
                <td>xxxxx</td>
                <td>xxxxx</td>
                <td>xxxxx</td>
                <td>xxxxx</td>
                <td class="text-center">
                  <q-btn-group>
                    <q-btn @click="mdl_edit = true, selectData(data)" glossy color="blue" icon="place" class="tbl_btn">
                      <q-tooltip content-class="bg-blue-9" content-style="font-size: 13px">
                        Click untuk melihat Maps
                      </q-tooltip>
                    </q-btn>
                    <q-btn @click="mdl_edit = true, selectData(data)" glossy color="orange" icon="create" class="tbl_btn">
                      <q-tooltip content-class="bg-orange-9" content-style="font-size: 13px">
                        Click untuk mengubah data ini
                      </q-tooltip>
                    </q-btn>
                    <q-btn @click="mdl_hapus = true, selectData(data)" glossy color="negative" icon="delete_forever" class="tbl_btn">
                      <q-tooltip content-class="bg-red" content-style="font-size: 13px">
                        Click untuk menghapus data ini
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
        <div class="text-center">
          <q-btn @click="btn_prev" glossy color="orange" icon="skip_previous" class="paginate_btn" />
            <span class="h_panation">&nbsp; {{page_first}} - {{page_last}} &nbsp;</span>
          <q-btn @click="btn_next" glossy color="orange" icon="skip_next" class="paginate_btn" />
        </div>














        <hr class="hrpagin2">


        <div class="row">
          <div class="col-md-1 col-12 text-center">
            <a href="javascript:void(0);" class="clear_underline">
              <img class="gbrDoc" src="https://e-dokumen.konaweselatankab.go.id/img/svg/pdf.png" alt="">
            </a>
          </div>
          <div class="col-md-11 col-12">
            <div class="">
              <a class="clear_underline h_judulDoc" href="javascript:void(0);">RENSTRA 2021-2026</a>
              <q-fab class="rizwan_sex" text-size="xs" glossy color="grey-6" icon="settings" padding="xs" direction="down">
                <q-fab-action color="orange-6" @click="onClickx('Saya edit')" icon="edit" label="Edit" />
                <q-fab-action color="red" @click="onClickx('Saya hapus')" icon="clear" label="Hapus" />
              </q-fab>
            </div>
            <div class="h_sidebar_menu">DINAS KOMUNIKASI INFORMASI DAN PERSANDIAN</div>
            <div class="h_titleDoc">@administrator - 29 November 2022</div>
          </div>


          
        </div>



        <hr class="hrpagin">
        <br>
        <div class="text-center">
          <q-btn @click="btn_prev" glossy color="orange" icon="skip_previous" class="paginate_btn" />
            <span class="h_panation">&nbsp; {{page_first}} - {{page_last}} &nbsp;</span>
          <q-btn @click="btn_next" glossy color="orange" icon="skip_next" class="paginate_btn" />
        </div>

















        <br>
      </q-card-section>
    </q-card>





          <!-- =================================================== MODAL =========================================================== -->


            <!-- ================================================= MODAL TAMBAH ================================================ -->
              <q-dialog v-model="mdl_add" persistent>
                <q-card class="mdl-md">
                  <q-card-section class="bg-primary">
                    <div class="text-h6 h_modalhead">Simpan Dataxxx</div>
                  </q-card-section>

                  <form @submit.prevent="addData()">
                    <q-card-section class="q-pt-none">
                        <br>

                        <div class="row">

                          <div class="col-12 col-md-12 frame_cari frame_cari">
                            <span class="h_lable ">Jenis Kategori Izin</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
                          </div>




                          <div class="col-12 col-md-6 frame_cari">
                            <span class="h_lable ">Side Kiri</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
                          </div>

                          <div class="col-12 col-md-6 frame_cari">
                            <span class="h_lable ">Side Kanan</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 
                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Keterangan</span>
                            <q-input v-model="form.keterangan" outlined square :dense="true" class="bg-white margin_btn" type="textarea"/>
                          </div>


                          <div class="col-12 col-md-12 frame_cari frame_cari">
                            <span class="h_lable ">Jenis Kategori Izin</span>
                            <q-input v-model="form.uraian" outlined square :dense="true" type="date" class="bg-white margin_btn" /> 
                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Select Biasa</span>
                            <select class="bg-white margin_btn">
                              <option value="1">Ini pertama</option>
                              <option value="1">Ini kedua</option>
                            </select>
                          </div>
                          
                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">Auto Complete with multy label</span>
                            <q-select
                              filled
                              v-model="model"
                              :options="options"
                              label="Pilih saja"
                              color="teal"
                              clearable
                              options-selected-class="text-deep-orange"
                            >
                              <template v-slot:option="scope">

                                <q-item v-if="!scope.opt.group" v-bind="scope.itemProps" v-on="scope.itemEvents">              
                                  <q-item-section avatar>
                                    <q-icon :name="scope.opt.icon" ></q-icon>
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label v-html="scope.opt.label" ></q-item-label>
                                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                  </q-item-section>
                                </q-item>

                              </template>
                            </q-select>

                          </div>

                          <div class="col-12 col-md-12 frame_cari">
                            <span class="h_lable ">autocomplete_db</span>
                            <q-select
                              v-model="autocomplete_db"
                              use-input
                              hide-selected
                              fill-input
                              input-debounce="0"
                              :options="$store.state.list_contoh_autocomplete"
                              option-value="id"
                              option-label="uraian"
                              @filter="autocomplete_db_filter"
                              emit-value
                              map-options
                              clearable outlined square :dense="true"
                          >

                            <template v-slot:no-option>
                              <q-item>
                                  <q-item-section class="text-grey">
                                  Tidak ditemukan
                                  </q-item-section>
                              </q-item>
                            </template>
                        </q-select>


                        {{autocomplete_db}}




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
                        <span class="h_lable ">Jenis Kategori Izin</span>
                        <q-input v-model="form.uraian" outlined square :dense="true" class="bg-white margin_btn" /> 

                        <span class="h_lable ">Keterangan</span>
                        <q-input v-model="form.keterangan" outlined square :dense="true" class="bg-white margin_btn" type="textarea"/>

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


import FETCHING from '../library/fetching'

export default {
  data() {
    return {

      form : {
        id : '',
        uraian : '',
        keterangan : '',
      },

      options: [
        {
          group: 'Group 1',
          disable: true
        },
        {
          label: 'Google',
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'Facebook',
          description: 'Social media',
          icon: 'bluetooth'
        },
        {
          label: 'Twitter',
          value: 'Twitter',
          description: 'Quick updates',
          icon: 'map'
        },
        { 
          group: 'Group 2',
          disable: true
        },
        {
          label: 'Apple',
          value: 'Apple',
          description: 'iStuff',
          icon: 'golf_course'
        },
        {
          label: 'Oracle',
          value: 'Oracle',
          description: 'Databases',
          icon: 'casino'
        }
      ],

      // ====================================== CONTOH AUTOCOMPLETE ====================================
      autocomplete_db : '',
      // ====================================== CONTOH AUTOCOMPLETE ====================================
      


     
      list_data : [],

      page_first: 1,
      page_last: 0,
      cari_value: "",
      cek_load_data : true,


      mdl_add: false,
      mdl_edit: false,
      mdl_hapus : false,
      btn_add: false,


      FETCHING : FETCHING,
    }
  },
  methods: {


    getView : function(){
      this.$store.commit("shoWLoading");
      fetch(this.$store.state.url.URL_MasterKategori + "view", {
          method: "POST",
          headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
              data_ke: this.page_first,
              cari_value: this.cari_value
          })
      })
          .then(res => res.json())
          .then(res_data => {
              this.list_data = res_data.data;
              this.page_last = res_data.jml_data;
              this.$store.commit("hideLoading");
              console.log(res_data);
      });
    },


    addData : function(number) {
      fetch(this.$store.state.url.URL_MasterKategori + "Add", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify(this.form)
      }).then(res_data => {
          this.Notify('Sukses Menambah Data', 'primary', 'check_circle_outline');
          this.getView();
      });
    },


    editData : function(){
      fetch(this.$store.state.url.URL_MasterKategori + "editData", {
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
      fetch(this.$store.state.url.URL_MasterKategori + "removeData", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({id : this.form.id})
      }).then(res_data => {
          this.Notify('Sukses Menghapus Data', 'negative', 'check_circle_outline');
          this.getView();
      });

    },

    selectData : function(data){
        this.form.id = data.id;
        this.form.uraian = data.uraian;
        this.form.keterangan = data.keterangan;
    },


    // ====================================== CONTOH eDOC ====================================
    onClickx(data){
      alert(data)
    },
    // ====================================== CONTOH eDOC ====================================

  // ====================================== CONTOH AUTOCOMPLETE ====================================
    autocomplete_db_filter : function (val, update) {
        update(() => {
          if (val === '') {}
          else {FETCHING.getContohAtocomplete(val)}
        })
    },

    // ====================================== CONTOH AUTOCOMPLETE ====================================








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


    // ====================================== PAGINATE ====================================







  },

  mounted () {
    FETCHING.getContohAtocomplete('')
    // this.getView();
  },
}
</script>




 