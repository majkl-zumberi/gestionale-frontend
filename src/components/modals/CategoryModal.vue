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
        <q-tab name="categoria" label="categoria articolo" />
      </q-tabs>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="categoria">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col">
              <q-input
                label="Codice categoria"
                v-model="category.code"
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
                label="descrizione"
                v-model="category.description"
                outlined
                dense
                clearable
                clear-icon="close"
              >
                <template v-slot:prepend>
                  <q-icon class="icon-margin" name="description" />
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
  name: "CategoryModal",
  props: ["id", "entity", "action", "hide"],
  data: function() {
    return {
      activeTab: "categoria",
      category: {
        code: "",
        description: ""
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
            `http://localhost:3000/category/${this.id}`,
            {
              ...this.category
            }
          );
          Notify.create("categoria modificata!");
          eventBus.$emit("items-update", data);
          this.hide();
        } catch (e) {
          Notify.create({
            color: "negative",
            message: e.e.response.data.error,
            icon: "report_problem"
          });
        }
      } else {
        try {
          const { data } = await axios.post(`http://localhost:3000/category`, {
            ...this.category
          });
          Notify.create("articolo aggiunto");
          eventBus.$emit("items-changed", data);
          this.hide();
        } catch (e) {
          console.log(e);
          Notify.create({
            color: "negative",
            message: e.response.data.error,
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
      const { data } = await axios.get(
        `http://localhost:3000/category/${this.id}`
      );
      console.log({ data });
      this.category = { ...data };
    }
  }
};
</script>

<style scoped>
.icon-margin {
  margin-right: 4px;
}
</style>
