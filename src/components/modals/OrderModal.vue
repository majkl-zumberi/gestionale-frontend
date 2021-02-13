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
        <q-tab name="articoli" label="articoli al nuovo ordine" />
        <q-tab name="ordine" label="nuovo ordine" />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="ordine">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-select
                :disable="id && order.customerId != ''"
                label="Cliente"
                v-model="order.customerId"
                :options="customerOptions"
                outlined
                dense
                clearable
                clear-icon="close"
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="face" />
                </template>
              </q-select>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="articoli">
          <div
            class="row q-col-gutter-md q-mb-lg"
            v-for="(detailArticle, idx) in order.articleOrders"
            :key="idx"
          >
            <div class="col">
              <q-select
                :disable="id && detailArticle.articleId != ''"
                label="Articolo"
                v-model="detailArticle.articleId"
                :options="articleOptions"
                outlined
                dense
                clearable
                clear-icon="close"
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="article" />
                </template>
              </q-select>
            </div>
            <div class="col">
              <q-input
                type="number"
                label="Quantità articolo"
                v-model.number="detailArticle.quantity"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="library_add" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                type="number"
                label="IVA %"
                v-model.number="detailArticle.iva"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="price_change" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                type="number"
                label="Sconto %"
                v-model.number="detailArticle.discount"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="price_change" />
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                type="string"
                label="Note"
                v-model.number="detailArticle.note"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="price_change" />
                </template>
              </q-input>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!--
      CARD BUTTONS
      visible only if user is in articoli tab
      visible only if add mode, not in edit
    -->
    <q-card-actions align="right">
      <q-btn
        v-if="activeTab === 'articoli' && action=='add'"
        :disable="
          typeof order.articleOrders === 'object' &&
            'articleOrders' in order &&
            order.articleOrders.some(
              art => art.articleId == '' || art.iva == '' || art.quantity == '' || art.discount == ''
            )
        "
        color="primary"
        label="aggiungi articolo"
        @click="
          () =>
            this.order.articleOrders.splice(
              this.order.articleOrders.length,
              0,
              { articleId: '', quantity: '', iva: '', note: '', discount: '' }
            )
        "
        icon="save"
      />
      <q-btn
        v-if="activeTab === 'articoli' && action=='add'"
        :disable="order.articleOrders.length == 1"
        color="primary"
        label="rimuovi articolo"
        @click="
          () =>
            this.order.articleOrders.splice(
              this.order.articleOrders.length - 1,
              1
            )
        "
        icon="save"
      />
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
  name: "OrderModal",
  props: ["id", "entity", "action", "hide"],
  data: function() {
    return {
      activeTab: "articoli",
      articleOptions: [],
      customerOptions: [],
      order: {
        customerId: "",
        articleOrders: [
          {
            articleId: "",
            quantity: "",
            iva: "",
            note: "",
            discount: ""
          }
        ]
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
          const updateDetailPromises= this.order.articleOrders.map(articleOrder=>{
            return axios.put(`http://localhost:3000/detail-order/order/${this.id}/article/${articleOrder.articleId}`,
            {
              quantity:articleOrder.quantity,
              iva:articleOrder.iva,
              note: articleOrder.note,
              discount: articleOrder.discount,
            });

          });
          axios.all({...updateDetailPromises}).then(resultArr=>{});
          Notify.create("ordine modificato!");
          //eventBus.$emit("items-update", data);
          this.hide();
        } catch (e) {
          Notify.create({
            color: "negative",
            message: e,
            icon: "report_problem"
          });
        }
      } else {
        try {
          const { data: customerOrderData } = await axios.post(
            `http://localhost:3000/order/${this.order.customerId}`
          );
          console.log({ customerOrderData });
          const detailOrderPromises = this.order.articleOrders.map(
            articleOrder => {
              return axios.post(
                `http://localhost:3000/detail-order/${customerOrderData.id}/${articleOrder.articleId}`,
                {
                  quantity: articleOrder.quantity,
                  iva: articleOrder.iva,
                  note: articleOrder.note,
                  discount: articleOrder.discount
                }
              );
            }
          );
          console.log({ detailOrderPromises });
          axios.all(...detailOrderPromises).then(responseArr => {});
          const { data: orderData } = await axios.get(
            `http://localhost:3000/order/${customerOrderData.id}`
          );
          Notify.create("ordine aggiunto");
          console.log({ orderData });
          eventBus.$emit("items-changed", orderData);
          this.hide();
        } catch (e) {
          console.log({ e });
          Notify.create({
            color: "negative",
            message: e,
            icon: "report_problem"
          });
        }
      }
    }
  },
  created: async function() {
    if (this.id) {
      // edit mode
      // fill current modal
      const { data: customerOrderData } = await axios.get(
        `http://localhost:3000/order/${this.id}`
      );
      const { data: detailData } = await axios.get(
        `http://localhost:3000/detail-order/order/${this.id}`
      );
      console.log({ detailData });
      const articleOrders = detailData.order.map(detail => {
        return {
          articleId: detail.article.id,
          quantity: detail.quantity,
          iva: detail.iva,
          note: detail.note,
          discount: detail.discount,
        };
      });
      this.order = {
        customerId: customerOrderData.user_id.id,
        articleOrders
      };
    }
    const { data } = await axios.get("http://localhost:3000/article");
    const mapped = data.map(({ id, name, measure }) => ({
      label: `${name} (${measure.code})`,
      value: id
    }));
    this.articleOptions = mapped;

    const { data: customerData } = await axios.get(
      "http://localhost:3000/customer"
    );
    const mappedCustomer = customerData.map(({ id, ccode, businessName }) => ({
      label: `${ccode} (${businessName})`,
      value: id
    }));
    this.customerOptions = mappedCustomer;
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 4px;
}
</style>
