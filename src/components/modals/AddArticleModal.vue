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
        <q-tab name="aggiungi articolo" label="aggiungi articolo" />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="anagrafica">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Nome articolo"
                v-model="article.name"
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
                label="categoria"
                v-model="article.category"
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
                type="number"
                label="Prezzo"
                v-model.number="article.price"
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
                type="date"
                hint="Scandenza"
                v-model="article.expiry"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="fas fa-phone" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                type="number"
                label="Disponibilità"
                v-model.number="article.available"
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
                type="url"
                label="Url"
                v-model="article.urlimg"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="crop_original" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-select
                label="unità di misura"
                v-model="article.measure"
                :options="measureOptions"
                outlined
                dense
                clearable
                clear-icon="close"
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="straighten" />
                </template>
              </q-select>
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
  name: "AddArticleModal",
  props: ["id", "entity", "action", "hide"],
  data: function() {
    return {
      activeTab: "anagrafica",
      measureOptions: [],
      article: {
        name: "",
        category: "",
        price: "",
        expiry: "",
        available: "",
        urlimg: "",
        measure: ""
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
            `http://localhost:3000/article/${this.id}`,
            {
              ...this.article
            }
          );
          Notify.create("articolo modificato!");
          eventBus.$emit("items-update", data);
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
          const {
            data
          } = await axios.post(
            `http://localhost:3000/article/${this.article.measure}`,
            { ...this.article }
          );
          Notify.create("articolo aggiunto");
          eventBus.$emit("items-changed", data);
          this.hide();
        } catch (e) {
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
    const { data } = await axios.get("http://localhost:3000/measure-unit");
    const mapped = data.map(({ id, code, description }) => ({
      label: code,
      value: id,
      description: description
    }));
    this.measureOptions = mapped;

    if (this.id) {
      // edit mode
      // fill current modal
      const { data } = await axios.get(
        `http://localhost:3000/article/${this.id}`
      );
      console.log({ data });
      this.article = { ...data, measure: data.measure.id };
    }
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 4px;
}
</style>
