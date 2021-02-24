<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="q-pa-md q-gutter-md">
        <q-list
          bordered
          padding
          class="rounded-borders"
          style="max-width: 350px"
        >
          <q-expansion-item
            expand-separator
            icon="signal_wifi_off"
            label="Fatturazione"
            style="color:black"
          >
            <q-item-label header>Dettaglio Fatturazione</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar icon="face" color="grey-8" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="dark" lines="1" overline
                  >Cliente</q-item-label
                >
                <q-item-label caption
                  >{{ customer.businessName }} ({{
                    customer.ccode
                  }})</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar
                  icon="my_location"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="dark" lines="1" overline
                  >Indirizzo</q-item-label
                >
                <q-item-label caption
                  >{{ invoiceTail.city }},{{
                    invoiceTail.address
                  }}</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" />
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

              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar icon="flag" color="teal" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" overline>Provincia</q-item-label>
                <q-item-label caption
                  >{{ invoiceTail.city }} ({{
                    invoiceTail.state
                  }})</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="signal_wifi_off"
            label="spedizione"
            style="color:black"
          >
            <q-item-label header>Dettagli Spedizione</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar
                  icon="monitor_weight"
                  color="brown-8"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" overline>Peso articoli</q-item-label>
                <q-item-label caption
                  >{{ invoiceTail.deliveryWeight }}KG</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" />
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

              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar
                  icon="event"
                  color="light-green-9"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" overline>Data Spedizione</q-item-label>
                <q-item-label caption>{{ formatDate }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            icon="paid"
            style="color:slategrey"
            label="Dettagli Importo"
          >
            <q-separator spaced />
            <q-item-label header>Totali</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section avatar top>
                <q-avatar
                  icon="attach_money"
                  color="green-8"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" overline
                  >Importo totale Articoli</q-item-label
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
                  >Importo totale scontato</q-item-label
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
                <q-item-label lines="1" overline
                  >Valore totale sconto</q-item-label
                >
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
                <q-item-label lines="1" overline
                  >Importo totale scontato + IVA</q-item-label
                >
                <q-item-label caption
                  >{{
                    totals.totalOrderPriceIva.toFixed(2)
                  }}&euro;</q-item-label
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
                <q-item-label lines="1" overline
                  >Valore Totale IVA</q-item-label
                >
                <q-item-label caption
                  >{{
                    totals.valueOrderPriceIva.toFixed(2)
                  }}&euro;</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date, format } from "quasar";
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
  }
};
</script>
