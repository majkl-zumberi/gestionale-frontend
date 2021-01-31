<template>
  <q-card>
    <q-toolbar>
      <q-avatar> </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold"
          >{{ action }} {{ title || entity }}</span
        >
      </q-toolbar-title>

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section>
      Sei sicuro di voler eliminare definitivamente?
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Annulla" @click="onCancelClick" />
      <q-btn
        color="primary"
        label="Elimina"
        @click="deleteItem"
        icon="delete"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import eventBus from "../../utils/eventBus";
import { Notify } from "quasar";
export default {
  name: "DeleteModal",

  props: ["id", "entity", "action", "item", "title", "hide"],
  data: function() {
    return {};
  },
  methods: {
    deleteItem: async function() {
      try {
        const { id, entity } = this;
        await this.$axios.delete(`http://localhost:3000/${entity}/${id}`);
        console.log("[id] ", id);
        eventBus.$emit("item-delete", id);
        Notify.create({
          message: "cancellato con successo!"
        });
        this.hide();
      } catch (e) {
        Notify.create({
          color: "negative",
          message: "Error",
          icon: "report_problem"
        });
      }
    },
    onCancelClick() {
      // we just need to hide dialogbut i need to create event i think , oltion save us!
      this.hide();
    }
  },
  computed: {},
  mounted: function() {
    console.log("(ITEM)", this.item);
  }
};
</script>

<style scoped>
.row {
  margin: 5px 0;
}
</style>
