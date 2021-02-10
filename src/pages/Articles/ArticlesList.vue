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
          :filter="filter"
          row-key="name"
        >
          <template v-slot:top-right>
            <q-input
              rounded
              filled
              dense
              debounce="300"
              v-model="filter"
              placeholder="Cerca"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                size="sm"
                round
                dense
                color="primary"
                icon="edit"
                @click.stop="
                  () => openNewArticleModal(props.row.id, 'AddArticle', 'edit')
                "
                class="q-mr-xs"
              />
              <q-btn
                size="sm"
                round
                dense
                color="secondary"
                icon="delete"
                @click.stop="
                  () =>
                    openNewArticleModal(
                      props.row.id,
                      'article',
                      'delete',
                      props.row,
                      props.row.name
                    )
                "
                class="q-mr-sm"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import crudModal from "../../components/modals/CrudModal";
import eventBus from "../../utils/eventBus";
import { date } from "quasar";
export default {
  name: "articlesList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "id",
          label: "Cod. Articolo",
          type: "string",
          field: article => article.id
        },
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
          field: article => article.category.code
        },
        {
          name: "price",
          label: "Prezzo",
          type: "string",
          field: article => article.price,
          format: price => `${price}€`
        },
        {
          name: "createdAt",
          label: "Data Creazione",
          type: "string",
          field: article => date.formatDate(article.createdAt, "DD-MM-YYYY")
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
        },
        {
          name: "actions",
          label: "Azioni",
          type: "actions"
        }
      ],
      articles: [],
      filter: ""
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
    },
    removeArticleFromList(articleId) {
      const idx = this.articles.findIndex(el => el.id === articleId);
      this.articles.splice(idx, 1);
    },
    updateArticle(articleToUpdate) {
      const idx = this.articles.findIndex(el => el.id === articleToUpdate.id);
      this.articles.splice(idx, 1, articleToUpdate);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/article").then(res => {
      this.articles = res.data;
    });

    eventBus.$on("items-changed", this.updateList);
    eventBus.$on("item-delete", this.removeArticleFromList);
    eventBus.$on("items-update", this.updateArticle);
  },
  beforeDestroy: function() {
    eventBus.$off("items-changed", this.updateList);
    eventBus.$off("item-delete", this.removeArticleFromList);
    eventBus.$off("items-update", this.updateArticle);
  }
};
</script>

<style scoped></style>
