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
                @click="() => openNewArticleModal(undefined, `Customer`, 'add')"
              />
              <q-btn color="white" stretch flat label="nuovo cliente" />
            </q-toolbar-title>
          </q-ribbon>
        </q-toolbar>
      </div>
      <q-card-section>
        <q-table
          flat
          title="Clienti"
          :data="customers"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          row-key="name"
        >
          <q-space />

          <template v-slot:top-right>
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              options-dense
              :display-value="'Filtra colonne'"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              options-cover
              style="min-width: 150px;margin-right:1.5em"
            />

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
                  () => openNewArticleModal(props.row.id, 'Customer', 'edit')
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
                      'customer',
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
export default {
  name: "CustomerList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "ccode",
          label: "Codice cliente",
          type: "string",
          field: customer => customer.ccode
        },
        {
          name: "businessName",
          label: "Ragione sociale",
          type: "string",
          field: customer => customer.businessName
        },
        {
          name: "email",
          label: "Email",
          type: "string",
          field: customer => customer.email
        },
        {
          name: "piva",
          label: "part.iva",
          type: "string",
          field: customer => customer.piva
        },
        {
          name: "city",
          label: "Città",
          type: "string",
          field: customer => customer.city
        },
        {
          name: "address",
          label: "Indirizzo",
          type: "string",
          field: customer => customer.address
        },
        {
          name: "cap",
          label: "Cap",
          type: "string",
          field: customer => customer.cap
        },
        {
          name: "state",
          label: "Provincia",
          type: "string",
          field: customer => customer.state
        },
        {
          name: "phonenr",
          label: "N.telefono",
          type: "string",
          field: customer => customer.phonenr
        },
        {
          name: "actions",
          label: "Azioni",
          type: "actions"
        }
      ],
      customers: [],
      visibleColumns: [
        "ccode",
        "businessName",
        "email",
        "piva",
        "city",
        "address",
        "cap",
        "state",
        "phonenr",
        "actions"
      ],
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
      this.customers.splice(this.customers.length, 0, newArticle);
    },
    removeArticleFromList(articleId) {
      const idx = this.customers.findIndex(el => el.id === articleId);
      this.customers.splice(idx, 1);
    },
    updateArticle(articleToUpdate) {
      const idx = this.customers.findIndex(el => el.id === articleToUpdate.id);
      this.customers.splice(idx, 1, articleToUpdate);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/customer").then(res => {
      this.customers = res.data;
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
