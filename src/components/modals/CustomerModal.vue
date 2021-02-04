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
        <q-tab name="cliente" label="Cliente" />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="cliente">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Codice Cliente"
                v-model="customer.ccode"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="article" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Ragione sociale"
                v-model="customer.businessName"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="category" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                type="email"
                label="Email"
                v-model.trim="customer.email"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="price_check" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Partita iva"
                v-model="customer.piva"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Città"
                v-model.number="customer.city"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="inventory_2" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Indirizzo"
                v-model="customer.address"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Cap"
                v-model="customer.cap"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Provincia"
                v-model="customer.state"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                label="Numero di telefono"
                v-model="customer.phonenr"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
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
      <q-btn color="primary" label="Salva" @click="upsertArticle" icon="save" />
    </q-card-actions>
  </q-card>
</template>

<script>
import axios from "axios";
import { Notify } from "quasar";
import eventBus from "../../utils/eventBus";
export default {
  name: "CustomerModal",
  props: ["id", "entity", "action", "hide"],
  data: function() {
    return {
      activeTab: "cliente",
      customer: {
        ccode: "",
        businessName: "",
        email: "",
        piva: "",
        city: "",
        address: "",
        cap: "",
        state: "",
        phonenr: ""
      }
    };
  },
  methods: {
    onCancelClick() {
      this.hide();
    },
    async upsertArticle() {
      if (this.id) {
        //edit mode
        try {
          const { data } = await axios.put(
            `http://localhost:3000/customer/${this.id}`,
            {
              ...this.customer
            }
          );
          Notify.create("cliente modificato!");
          eventBus.$emit("items-update", data);
          this.hide();
        } catch (e) {
          Notify.create({
            color: "negative",
            message: e.response.data.error,
            icon: "report_problem"
          });
        }
      } else {
        try {
          const { data } = await axios.post(`http://localhost:3000/customer`, {
            ...this.customer
          });
          Notify.create("cliente aggiunto!");
          eventBus.$emit("items-changed", data);
          this.hide();
        } catch (e) {
          if (
            "message" in e.response.data &&
            typeof e.response.data.message == "object"
          ) {
            e.response.data.message.forEach(error => {
              Notify.create({
                color: "negative",
                message: error,
                icon: "report_problem"
              });
            });
          } else {
            console.log({ e });
            Notify.create({
              color: "negative",
              message: e.response.data.error,
              icon: "report_problem"
            });
          }
        }
      }
    }
  },
  created: async function() {
    if (this.id) {
      // edit mode
      // fill current modal
      const { data } = await axios.get(
        `http://localhost:3000/customer/${this.id}`
      );
      console.log({ data });
      this.customer = { ...data };
    }
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 4px;
}
</style>
