<template>
  <q-page padding>
    <q-table
      title="Articles"
      :data="articles"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script>
import axios from "axios";

export default {
name: "articlesList",
  components: {},
  data(){
  return {
    columns:[
      {name:"name", label:"Nome", type:"string", field: article => article.name},
      {name:"category", label:"Categoria", type:"string", field: article => article.category},
      {name:"urlimg", label: "Immagine", type:"string", field: article => article.urlimg},
      {name:"price", label:"Prezzo", type:"string", field: article => article.price},
      {name:"expiry", label:"Scadenza", type:"string", field: article => article.expiry},
      {name:"available", label:"Disponibilità", type:"string", field: article => article.available},
      {name:"measureId", label:"Unità di Misura", type:"string", field: article => article.measureId},
    ],
    articles:[]
  }
  },
  created: function(){
    axios.get("http://localhost:3000/article").then(res => {
     this.articles = res.data;
    })
  }

}
</script>

<style scoped>

</style>
