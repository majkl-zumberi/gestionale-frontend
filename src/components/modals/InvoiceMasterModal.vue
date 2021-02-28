<template>
  <q-card>
    <q-card-section class="  flex-center">
      <q-tabs
        active-color="primary"
        indicator-color="primary"
        v-model="activeTab"
        align="left"
        shrink
        left
      >
        <q-tab name="ordine" label="ordine" />
        <q-tab name="trasporto" label="trasporto" />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="ordine">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-select
                label="ordine"
                v-model="invoice.orderId"
                :options="orderOptions"
                outlined
                dense
                clearable
                clear-icon="close"
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="category" />
                </template>
              </q-select>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="trasporto">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Città"
                v-model.number="invoice.city"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="apartment" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Indirizzo"
                v-model="invoice.address"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="home" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Cap"
                v-model="invoice.cap"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="import_contacts" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Provincia"
                v-model="invoice.state"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="place" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                type="number"
                label="Peso trasporto"
                v-model="invoice.deliveryWeight"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="vpn_key" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                type="date"
                hint="data trasporto"
                v-model="invoice.deliveryData"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="work" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Metodo pagamento"
                v-model="invoice.paymentMethod"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="vpn_key" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                type="number"
                label="Costo spedizione"
                v-model="invoice.deliveryPrice"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="work" />
                </template>
              </q-input>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!--CARD BUTTONS-->
    <q-card-actions align="right">
      <q-btn
        color="primary"
        label="Annulla"
        @click="onCancelClick"
        icon="close"
      />
      <q-btn color="primary" label="Salva" @click="saveInvoice" icon="save" />
    </q-card-actions>
  </q-card>
</template>

<script>
import axios from "axios";
import { Notify } from "quasar";
import eventBus from "../../utils/eventBus";
export default {
  name: "InvoiceMasterModal",
  props: ["id", "entity", "action", "hide"],
  data: function() {
    return {
      activeTab: "ordine",
      orderOptions: [],
      invoice: {
        orderId: "",
        city: "",
        address: "",
        cap: "",
        state: "",
        deliveryWeight: "",
        deliveryData: "",
        paymentMethod: "",
        deliveryPrice: ""
      }
    };
  },
  methods: {
    onCancelClick() {
      this.hide();
    },
    async saveInvoice() {
      const userId = this.orderOptions.find(
        order => order.value === this.invoice.orderId
      ).user.id;

      const { data: invoiceMaster } = await axios.post(
        `http://localhost:3000/invoice-master/${userId}/${this.invoice.orderId}`
      );

      const { data: invoiceBody } = await axios.post(
        `http://localhost:3000/invoice/${this.invoice.orderId}/${invoiceMaster.id}`
      );

      const { data: invoiceTail } = await axios.post(
        `http://localhost:3000/invoice-tail/${invoiceMaster.id}`,
        {
          ...this.invoice
        }
      );

      const { data } = await axios.get(
        `http://localhost:3000/invoice-master/${invoiceMaster.id}`
      );

      Notify.create("Fattura aggiunta!");
      eventBus.$emit("items-changed", data);
    }
  },
  created: async function() {
    const { data } = await axios.get("http://localhost:3000/order");
    const mappedOrder = data.map(({ id, user_id }) => ({
      label: `ordine nr.${id}, ${user_id.ccode} (${user_id.businessName})`,
      user: user_id,
      value: id
    }));
    this.orderOptions = mappedOrder;
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 4px;
}
</style>
