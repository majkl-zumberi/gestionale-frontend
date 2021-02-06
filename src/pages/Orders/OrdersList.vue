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
          title="Ordini"
          :data="orders"
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
                  () => openNewArticleModal(props.row.id, 'Order', 'edit')
                "
                class="q-mr-xs"
              />
              <q-btn
                size="sm"
                round
                dense
                color="accent"
                icon="search"
                @click="openDetailOrder(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                size="sm"
                round
                dense
                color="negative"
                icon="delete"
                @click.stop="
                  () =>
                    openNewArticleModal(
                      props.row.id,
                      'order',
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
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- struttura tabell qua-->
          <q-table
            flat
            title="Dettaglio Ordine"
            :data="detailOrder.order"
            :columns="detailColumns"
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
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import crudModal from "../../components/modals/CrudModal";
import eventBus from "../../utils/eventBus";
import { date } from "quasar";
export default {
  name: "ordersList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "id",
          label: "Nr Ordine",
          type: "string",
          align: 'center',
          field: order => order.id
        },
        {
          name: "date",
          label: "Data ordine",
          type: "string",
          align: 'center',
          field: order => order.date
        },
        {
          name: "ccode",
          label: "Codice Cliente",
          type: "string",
          align: 'center',
          field: order => order.user_id.ccode,
        },
        {
          name: "actions",
          label: "Azioni",
          align: 'center',
          type: "actions"
        }
      ],
      orders: [],
      filter: "",
      dialog: false,
      maximizedToggle: true,
      detailOrder: [],
      detailColumns: [
        {
          name: "id",
          label: "Codice Articolo",
          type: "string",
          align: 'center',
          field: order => order.article.id
        },
        {
          name: "name",
          label: "Descrizione Articolo",
          type: "string",
          align: 'center',
          field: order => order.article.name
        },
        {
          name: "price",
          label: "Prezzo",
          type: "string",
          align: 'center',
          field: order => order.article.price
        },
        {
          name: "createdAt",
          label: "Data Creazione",
          type: "string",
          align: 'center',
          field: order => order.article.createdAt
        },
        {
          name: "iva",
          label: "IVA",
          type: "string",
          align: 'center',
          field: order => order.iva
        },
        {
          name: "total",
          label: "Imponibile",
          type: "string",
          align: 'center',
          field: order => order.total
        },
        {
          name: "totalIva",
          label: "Totale",
          type: "string",
          align: 'center',
          field: order => order.totalIva
        },
      ]
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

    openDetailOrder: function (idOrder){
      this.dialog = true
      axios.get(`http://localhost:3000/detail-order/order/${idOrder}`).then(res => {
        this.detailOrder = res.data;
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
    axios.get("http://localhost:3000/order").then(res => {
      this.orders = res.data;
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
