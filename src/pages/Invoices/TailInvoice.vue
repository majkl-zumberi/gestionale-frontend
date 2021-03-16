<template>
  <div class="justify-evenly row q-pa-md q-gutter-md text-black">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="receipt_long" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Fatturazione</q-item-label>
          <q-item-label caption>
            Dettaglio Fatturazione
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="face" color="grey-8" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="dark" lines="1" overline>Cliente</q-item-label>
            <q-item-label caption
              >{{ customer.businessName }} ({{ customer.ccode }})</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="my_location" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="dark" lines="1" overline
              >Indirizzo</q-item-label
            >
            <q-item-label caption
              >{{ invoiceTail.city }},{{ invoiceTail.address }}</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="place" color="orange" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>CAP</q-item-label>
            <q-item-label caption>{{ invoiceTail.cap }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="flag" color="teal" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Provincia</q-item-label>
            <q-item-label caption
              >{{ invoiceTail.city }} ({{ invoiceTail.state }})</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="local_shipping" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Spedizione</q-item-label>
          <q-item-label caption>
            Dettagli Spedizione
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="monitor_weight"
              color="brown-8"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Peso Articoli</q-item-label>
            <q-item-label caption
              >{{ invoiceTail.deliveryWeight }}KG</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="local_shipping"
              color="deep-orange-9"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Costo Spedizione</q-item-label>
            <q-item-label caption
              >{{ invoiceTail.deliveryPrice }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="event" color="light-green-9" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Data Spedizione</q-item-label>
            <q-item-label caption>{{ formatDate }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="paid" size="42px" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Totali</q-item-label>
          <q-item-label caption>
            Dettagli Importo
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="attach_money" color="green-8" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline
              >Imposta Totale Articoli</q-item-label
            >
            <q-item-label caption
              >{{ totals.totalOrderPrice.toFixed(2) }}€</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="sell" color="orange-7" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline
              >Imposta Totale Scontato</q-item-label
            >
            <q-item-label caption
              >{{
                totals.totalOrderPriceDiscount.toFixed(2)
              }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="money_off"
              color="deep-orange-8"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Valore Totale Sconto</q-item-label>
            <q-item-label caption
              >{{
                totals.valueOrderPriceDiscount.toFixed(2)
              }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="price_check"
              color="light-green-9"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Imponibile Totale</q-item-label>
            <q-item-label caption
              >{{ totals.totalOrderPriceIva.toFixed(2) }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="request_quote"
              color="deep-purple-10"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Valore Totale IVA</q-item-label>
            <q-item-label caption
              >{{ totals.valueOrderPriceIva.toFixed(2) }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>
         <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="savings"
              color="deep-purple-10"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Ulteriore sconto (coda %)</q-item-label>
            <q-item-label caption
              >{{ invoiceTail.tailDiscount }}%
              <q-popup-edit v-model="invoiceTail.tailDiscount" :cover="false" :offset="[0, 10]">
                <q-input
                  v-model="invoiceTail.tailDiscount"
                  type="number"
                 dense autofocus counter
                  @change="e =>updateTailDiscount()">
                  <template v-slot:prepend>
                    <q-icon name="savings"  />
                  </template>
                </q-input>
              </q-popup-edit>
        </q-item-label>

          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar
              icon="point_of_sale"
              color="deep-purple-10"
              text-color="white"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" overline>Valore sconto (coda)</q-item-label>
            <q-item-label caption
              >{{ invoiceTail.tailDiscountValue.toFixed(2) }}&euro;</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date, format } from "quasar";
import eventBus from "../../utils/eventBus";
export default {
  name: "tailInvoice",
  props: ["invoiceTail", "customer", "totals"],
  data() {
    return {};
  },
  computed: {
    formatDate() {
      return date.formatDate(this.invoiceTail.deliveryData, "DD-MM-YYYY");
    }
  },
  methods:{
    updateTailDiscount(){
      console.log("pronto a salvare il nuovo valore")
      console.log(this.invoiceTail.tailDiscount)
      eventBus.$emit("tailInvoice-changed", {id:this.invoiceTail.id,tailDiscount:this.invoiceTail.tailDiscount});
    }
  }
};
</script>
<style scoped>
.my-card {
  width: 28%;
}
</style>
