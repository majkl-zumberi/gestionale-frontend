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
          <q-item-label header>dettaglio Fatturazione</q-item-label>

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

            <q-item-section side>
              <q-icon name="info"/>
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
                >{{ invoiceTail.city }} ({{ invoiceTail.state }})</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>Dettagli Spedizione</q-item-label>

          <q-item clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="monitor_weight" color="brown-8" text-color="white" />
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
              <q-avatar icon="local_shipping" color="deep-orange-9" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" overline>Costo Spedizione</q-item-label>
              <q-item-label caption
                >{{ invoiceTail.deliveryPrice }}&euro;</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-icon name="info"/>
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

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date, format } from "quasar";
export default {
  name: "tailInvoce",
  props: ["invoiceTail"],
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
