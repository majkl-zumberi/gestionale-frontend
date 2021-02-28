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
                  () => openNewArticleModal(undefined, `InvoiceMaster`, 'add')
                "
              />
              <q-btn color="white" stretch flat label="nuova fattura" />
            </q-toolbar-title>
          </q-ribbon>
        </q-toolbar>
      </div>
      <q-card-section>
        <q-table
          flat
          title="Fatture"
          :data="invoiceMaster"
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
                color="accent"
                icon="search"
                @click="openDetailOrder(props.row)"
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
                      'invoice-master',
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
import DetailInvoice from "pages/Invoices/DetailInvoice";
export default {
  name: "invoicesList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "nDoc",
          label: "Nr Fattura ",
          type: "string",
          align: "center",
          field: order => order.nDoc
        },
        {
          name: "date",
          label: "Data Fattura",
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
          field: order => order.customer.ccode
        },
        {
          name: "businessName",
          label: "Ragione Sociale",
          type: "string",
          align: "center",
          field: order => order.customer.businessName
        },
        {
          name: "actions",
          label: "Azioni",
          align: "center",
          type: "actions"
        }
      ],
      invoiceMaster: [],
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
    openDetailOrder: async function(detailRow) {
      console.log(detailRow.customer);
      this.dialog = true;
      const { data: invoiceTail } = await axios.get(
        `http://localhost:3000/invoice-tail/master/${detailRow.id}`
      );
      axios
        .get(`http://localhost:3000/invoice/master/${detailRow.id}`)
        .then(res => {
          this.$q.dialog({
            component: DetailInvoice,
            invoiceBody: res.data,
            tailInvoice: invoiceTail,
            masterId: detailRow.id,
            customer: detailRow.customer,
            parent: this
          });
        });
    },

    updateList(newArticle) {
      this.invoiceMaster.splice(this.invoiceMaster.length, 0, newArticle);
    },
    removeArticleFromList(articleId) {
      const idx = this.invoiceMaster.findIndex(el => el.id === articleId);
      this.invoiceMaster.splice(idx, 1);
    },
    updateArticle(articleToUpdate) {
      const idx = this.invoiceMaster.findIndex(
        el => el.id === articleToUpdate.id
      );
      this.invoiceMaster.splice(idx, 1, articleToUpdate);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/invoice-master").then(res => {
      this.invoiceMaster = res.data;
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
