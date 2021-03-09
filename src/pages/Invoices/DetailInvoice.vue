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

      <div>
        <q-splitter v-model="splitterModel" style="height: 96vh">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-white">
              <q-tab
                style="height:48vh"
                name="invoiceBody"
                icon="receipt_long"
                label="Info fattura"
              />
              <q-tab
                style="height:48vh"
                name="tailInvoice"
                icon="local_shipping"
                label="Info trasporto"
              />
              <!-- <q-tab name="movies" icon="movie" label="Movies" /> -->
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="invoiceBody">
                <div class="text-h4 q-mb-md">Mails</div>
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
                            :decimals="2"
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
                    <q-btn
                      color="primary"
                      icon-right="archive"
                      label="esporta in csv"
                      no-caps
                      style="min-width: 150px;margin-right:1.5em"
                      @click="exportTable"
                    />
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
              </q-tab-panel>

              <q-tab-panel name="tailInvoice">
                <div class="text-h4 q-mb-md">tail invoice</div>
                <TailInvoice
                  :invoiceTail="tailInvoice"
                  :customer="customer"
                  :totals="internalInvoiceBody"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import TailInvoice from "./TailInvoice";
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
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
        "valueIva",
        "netPrice",
        "rowTotal"
      ],
      detailColumns: [
        {
          name: "id",
          label: "Id",
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
          label: "Valore Unitario",
          type: "number",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.article.price,
          format: price => `${price}€`
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
          label: "Importo sconto(€)",
          type: "number",
          align: "center",
          editable: true,
          sortable: true,
          field: order => order.valueDiscount,
          format: discount => parseInt(discount).toFixed(2)
        },
        {
          name: "netPrice",
          label: "Prezzo Netto", // Valore unitario - sconto
          type: "number",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.netPrice,
          format: price => `${price.toFixed(2)}`
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
          name: "totalDiscount",
          label: "Imponibile", //tot scontato -iva
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.totalDiscount,
          format: price => `${price.toFixed(2)}€`
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
          name: "valueIva",
          label: "Importo IVA",
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.valueIva,
          format: price => `${price.toFixed(2)}€`
        },
        {
          name: "totalIva",
          label: "Imposta", //Totale scontato +iva
          type: "string",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.totalIva,
          format: price => `${price}€`
        },
        {
          name: "rowTotal",
          label: "Totale Riga", //Totale scontato +iva
          type: "number",
          align: "center",
          editable: false,
          sortable: true,
          field: order => order.rowTotal,
          format: price => `${price.toFixed(2)}€`
        }
      ],
      tab: "invoiceBody",
      splitterModel: 2
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
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.detailColumns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.internalInvoiceBody.order.map(row =>
            this.detailColumns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("fattura.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  created() {
    this.internalInvoiceBody = { ...this.invoiceBody };
  }
};
</script>
