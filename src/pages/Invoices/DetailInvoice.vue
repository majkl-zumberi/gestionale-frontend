<template>
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

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip
            v-if="maximizedToggle"
            content-class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip
            v-if="!maximizedToggle"
            content-class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <div class="row">
        <q-card-section class="col-3">
          <TailInvoice
            :invoiceTail="tailInvoice"
            :customer="customer"
            :totals="internalInvoiceBody"
          />
        </q-card-section>

        <q-card-section class="col-9">
          <!-- struttura tabell qua-->
          <q-table
            flat
            title="Dettaglio Fattura"
            :data="internalInvoiceBody.order"
            :columns="detailColumns"
            :filter="filter"
            :visible-columns="visibleColumns"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  v-for="tdVal in props.cols"
                  :key="tdVal.name"
                  :props="props"
                >
                  {{ tdVal.value }}
                  <q-popup-edit
                    :title="'Aggiorna ' + tdVal.label"
                    :value="props.row[tdVal.name]"
                    v-if="isColumnEditable(tdVal.name)"
                  >
                    <q-input
                      :type="getColumnTypeByName(tdVal.name)"
                      v-model="props.row[tdVal.name]"
                      dense
                      autofocus
                      counter
                      @change="
                        e =>
                          tdVal.name === 'valueDiscount'
                            ? calculateDiscount(
                                props.row['total'],
                                props.row.order.id,
                                props.row.article.id,
                                props.row[tdVal.name],
                                tdVal.name
                              )
                            : updateBodyInvoiceRecordVal(
                                props.row.order.id,
                                props.row.article.id,
                                props.row[tdVal.name],
                                tdVal.name
                              )
                      "
                    />
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
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
                :options="detailColumns"
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
                  @click.stop="() => {}"
                  class="q-mr-xs"
                />
                <q-btn
                  size="sm"
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click.stop="() => {}"
                  class="q-mr-sm"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import TailInvoice from "./TailInvoice";
export default {
  name: "detailInvoiceMaximized",
  props: ["invoiceBody", "tailInvoice", "customer", "masterId"],
  components: {
    TailInvoice
  },
  data() {
    return {
      filter: "",
      dialog: true,
      maximizedToggle: true,
      internalInvoiceBody: {},
      visibleColumns: [
        "id",
        "name",
        "quantity",
        "price",
        "iva",
        "discount",
        "valueDiscount",
        "note",
        "total",
        "totalDiscount",
        "totalIva",
        "valueIva"
      ],
      detailColumns: [
        {
          name: "id",
          label: "id",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.id
        },
        {
          name: "name",
          label: "Desc. Articolo",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.article.name
        },
        {
          name: "quantity",
          label: "Quantità",
          type: "number",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.quantity
        },
        {
          name: "price",
          label: "Prezzo",
          type: "number",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.article.price,
          format: price => `${price}€`
        },
        {
          name: "iva",
          label: "IVA(%)",
          type: "number",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.iva
        },
        {
          name: "discount",
          label: "Sconto(%)",
          type: "number",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.discount
        },
        {
          name: "valueDiscount",
          label: "Valore sconto(€)",
          type: "number",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.valueDiscount,
          format: discount => parseInt(discount).toFixed(2)
        },
        {
          name: "note",
          label: "Note",
          type: "string",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.note
        },
        {
          name: "total",
          label: "totale",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.total,
          format: price => `${price.toFixed(2)}€`
        },
        {
          name: "totalDiscount",
          label: "tot scontato -iva",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.totalDiscount,
          format: price => `${price.toFixed(2)}€`
        },
        {
          name: "totalIva",
          label: "Totale scontato +iva",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.totalIva,
          format: price => `${price}€`
        },
        {
          name: "valueIva",
          label: "val iva",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.valueIva,
          format: price => `${price.toFixed(2)}€`
        }
      ]
    };
  },
  methods: {
    getColumnTypeByName(name) {
      return this.detailColumns.find(col => col.name == name).type;
    },
    isColumnEditable(name) {
      return this.detailColumns.find(col => col.name == name).editable;
    },
    updateBodyInvoiceRecordVal(idOrder, idArticle, nuovoValore, tipoModifica) {
      console.log({ idOrder });
      console.log({ idArticle });
      console.log({ nuovoValore });
      console.log({ tipoModifica });
      const body = { [tipoModifica]: nuovoValore };
      axios
        .put(
          `http://localhost:3000/invoice/order/${idOrder}/article/${idArticle}`,
          {
            ...body
          }
        )
        .then(res => {
          axios
            .get(`http://localhost:3000/invoice/master/${this.masterId}`)
            .then(res => {
              this.internalInvoiceBody = { ...res.data };
            });
        });
    },
    calculateDiscount(total, idOrder, idArticle, nuovoValore, tipoModifica) {
      console.log("entro in calcolo sconto");
      const discount = (nuovoValore / total) * 100;
      this.updateBodyInvoiceRecordVal(idOrder, idArticle, discount, "discount");
    }
  },
  created() {
    this.internalInvoiceBody = { ...this.invoiceBody };
  }
};
</script>
