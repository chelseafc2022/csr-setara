// import Swal from 'sweetalert2'
const Swal = require('sweetalert2')
var DataStore = require('../store');
var store = DataStore.default;
var storex =store.state


  const getMasterMenu = async ()=>{
    return new Promise(resolve=>{
      fetch(storex.url.URL_DM_KLP_USERS + "listAdd", {
          method: "GET",
          headers: {
          "content-type": "application/json",
          authorization: "kikensbatara " + localStorage.token
          }
        })
          .then(res => res.json())
          .then(res_data => {
            // console.log(res_data)
            resolve(res_data)
  
      });
    })
  }
  
  // ini buat ambil menu pada saat edit data
  const postMasterMenu = async (id)=>{
    return new Promise(resolve=>{
      fetch(storex.url.URL_DM_KLP_USERS + "listEdit", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
            menu_klp_id: id,
          })
        })
          .then(res => res.json())
          .then(res_data => {
            // console.log(res_data)
            resolve(res_data)
  
      });
    })
  }
  
  
  const postMasterKlpMenu = async ()=>{
    return new Promise(resolve=>{
      fetch(storex.url.URL_DM_KLP_USERS + "list", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
            menu_klp_id: 'id',
          })
        })
          .then(res => res.json())
          .then(res_data => {
            console.log(res_data)
            resolve(res_data)
  
      });
    })
  }
  
  
  const postMasterMenuGetSideBar = async (id)=>{
    console.log('postMasterMenuGetSideBar');
    return new Promise(resolve=>{
      fetch(storex.url.URL_DM_KLP_USERS + "listSidebar", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
            side_bar : true,
            menu_klp_id: id,
          })
        })
          .then(res => res.json())
          .then(res_data => {
            console.log(res_data)
            resolve(res_data)
  
      });
    })
  }



  // ====================================== CONTOH AUTOCOMPLETE ====================================
  const getContohAtocomplete = (val)=>{

      fetch(storex.url.checkAuth + "autocomplete_db", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "kikensbatara " + localStorage.token
          },
          body: JSON.stringify({
            val : val,
          })
        })
          .then(res => res.json())
          .then(res_data => {
            
            storex.list_contoh_autocomplete = res_data
      });
  }

  // ====================================== CONTOH AUTOCOMPLETE ====================================



  


module.exports = {

    getMasterMenu : getMasterMenu,
    postMasterMenu : postMasterMenu,
    postMasterMenuGetSideBar : postMasterMenuGetSideBar,
    postMasterKlpMenu : postMasterKlpMenu,
    getContohAtocomplete : getContohAtocomplete,
}