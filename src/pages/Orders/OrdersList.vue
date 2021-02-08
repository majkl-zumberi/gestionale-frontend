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
                @click="() => openNewArticleModal(undefined, `Order`, 'add')"
              />
              <q-btn color="white" stretch flat label="nuovo ordine" />
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
  </q-page>
</template>

<script>
import axios from "axios";
import crudModal from "../../components/modals/CrudModal";
import eventBus from "../../utils/eventBus";
import { date, format } from "quasar";
import DetailListItem from "./DetailListItem";
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
          align: "center",
          field: order => order.id
        },
        {
          name: "date",
          label: "Data ordine",
          type: "string",
          align: "center",
          field: order => order.date,
          format: data => date.formatDate(data, "DD-MM-YYYY")
        },
        {
          name: "ccode",
          label: "Codice Cliente",
          type: "string",
          align: "center",
          field: order => order.user_id.ccode
        },
        {
          name: "businessName",
          label: "Ragione Sociale",
          type: "string",
          align: "center",
          field: order => order.user_id.businessName
        },
        {
          name: "actions",
          label: "Azioni",
          align: "center",
          type: "actions"
        }
      ],
      orders: [],
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
    openDetailOrder: function(idOrder) {
      this.dialog = true;
      axios
        .get(`http://localhost:3000/detail-order/order/${idOrder}`)
        .then(res => {
          this.detailOrder = res.data;
          this.$q.dialog({
            component: DetailListItem,
            detailOrder: res.data,
            parent: this
          });
        });
    },

    updateList(newArticle) {
      this.orders.splice(this.orders.length, 0, newArticle);
    },
    removeArticleFromList(articleId) {
      const idx = this.orders.findIndex(el => el.id === articleId);
      this.orders.splice(idx, 1);
    },
    updateArticle(articleToUpdate) {
      const idx = this.orders.findIndex(el => el.id === articleToUpdate.id);
      this.orders.splice(idx, 1, articleToUpdate);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/order").then(res => {
      this.orders = res.data;
    })

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
