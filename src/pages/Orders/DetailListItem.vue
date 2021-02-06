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
                @click.stop="() => {}"
                class="q-mr-xs"
              />
              <q-btn
                size="sm"
                round
                dense
                color="secondary"
                icon="delete"
                @click.stop="() => {}"
                class="q-mr-sm"
              />
            </q-td>
          </template>
          <template v-slot:bottom-row>
            <q-tr>
              <q-td colspan="100%">
                Costo totale Articoli
                {{ detailOrder.totalOrderPrice.toFixed(2) }}€
              </q-td>
            </q-tr>
            <q-tr>
              <q-td colspan="100%">
                Costo totale Articoli + IVA
                {{ detailOrder.totalOrderPriceIva.toFixed(2) }}€
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "detailModal",
  props: ["detailOrder"],
  data() {
    return {
      filter: "",
      dialog: true,
      maximizedToggle: true,
      detailColumns: [
        {
          name: "id",
          label: "Codice Articolo",
          type: "string",
          align: "center",
          field: order => order.article.id
        },
        {
          name: "name",
          label: "Descrizione Articolo",
          type: "string",
          align: "center",
          field: order => order.article.name
        },
        {
          name: "quantity",
          label: "Quantità",
          type: "string",
          align: "center",
          field: order => order.quantity
        },
        {
          name: "price",
          label: "Prezzo",
          type: "string",
          align: "center",
          field: order => order.article.price,
          format: price => `${price}€`
        },
        {
          name: "iva",
          label: "IVA",
          type: "string",
          align: "center",
          field: order => order.iva,
          format: price => `${price}%`
        },
        {
          name: "total",
          label: "Imponibile",
          type: "string",
          align: "center",
          field: order => order.total,
          format: price => `${price.toFixed(2)}€`
        },
        {
          name: "totalIva",
          label: "Totale",
          type: "string",
          align: "center",
          field: order => order.totalIva,
          format: price => `${price}€`
        }
      ]
    };
  }
};
</script>
