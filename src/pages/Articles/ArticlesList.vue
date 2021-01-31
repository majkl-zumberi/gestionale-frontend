<template>
  <q-page padding>
    <q-card>
      <div class="box-ribbon-wrapper q-pt-xs">
        <q-toolbar class="text-white q-my-md">
          <q-ribbon
            position="left"
            color="rgba(0,0,0,.58)"
            background-color="#00588d"
            leaf-color="#a0a0a0"
            leaf-position="bottom"
            decoration="rounded-out"
          >
            <q-toolbar-title class="example-title">
              <q-btn
                flat
                round
                dense
                icon="control_point"
                class="q-mr-sm"
                size="md"
                color="white"
                @click="
                  () => openNewArticleModal(undefined, `AddArticle`, 'add')
                "
              />
              <q-btn color="white" stretch flat label="nuovo articolo" />
            </q-toolbar-title>
          </q-ribbon>
        </q-toolbar>
      </div>
      <q-card-section>
        <q-table
          flat
          title="Articoli"
          :data="articles"
          :columns="columns"
          row-key="name"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import crudModal from "../../components/modals/CrudModal";
import eventBus from "../../utils/eventBus";
export default {
  name: "articlesList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "name",
          label: "Nome",
          type: "string",
          field: article => article.name
        },
        {
          name: "category",
          label: "Categoria",
          type: "string",
          field: article => article.category
        },
        {
          name: "urlimg",
          label: "Immagine",
          type: "string",
          field: article => article.urlimg
        },
        {
          name: "price",
          label: "Prezzo",
          type: "string",
          field: article => article.price,
          format: price => `${price}€`
        },
        {
          name: "expiry",
          label: "Scadenza",
          type: "string",
          field: article => article.expiry
        },
        {
          name: "available",
          label: "Disponibilità",
          type: "string",
          field: article => article.available
        },
        {
          name: "code",
          label: "Unità di Misura",
          type: "string",
          field: article => article.measure.code
        }
      ],
      articles: []
    };
  },
  methods: {
    openNewArticleModal: function(id, entity, action, item, title = "") {
      this.$q.dialog({
        component: crudModal,
        id: id,
        entity: entity,
        action: action,
        item: item,
        title: title,
        parent: this
      });
    },
    updateList(newArticle) {
      this.articles.splice(this.articles.length, 0, newArticle);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/article").then(res => {
      this.articles = res.data;
    });

    eventBus.$on("items-changed", this.updateList);
  },
  beforeDestroy: function() {
    eventBus.$off("items-changed", this.updateList);
  }
};
</script>

<style scoped></style>
