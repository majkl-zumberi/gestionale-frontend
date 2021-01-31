<template>
  <q-dialog transition-show="rotate" ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <!--
        ...content
        ... use q-card-section for it?
      -->
      <template>
        <component
          :id="id"
          :entity="entity"
          :action="action"
          :item="item"
          :title="title"
          :hide="hide"
          :is="appropriateComponent"
        ></component>
      </template>
      <!-- buttons example -->
      <!--      <q-card-actions align="right">-->
      <!--        <q-btn color="primary" label="OK" @click="onOKClick" />-->
      <!--        <q-btn color="primary" label="Cancel" @click="onCancelClick" />-->
      <!--      </q-card-actions>-->
    </q-card>
  </q-dialog>
</template>

<script>
import Modals from "./index";
export default {
  props: ["id", "entity", "action", "item", "title"],
  components: {},
  data() {
    return {};
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      console.log("id", this.id);
      console.log("entity", this.entity);
      console.log("action", this.action);
      console.log("item", this.item);
      console.log("$refs", this.$refs);
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  },
  computed: {
    appropriateComponent: function() {
      return this.action === "delete"
        ? Modals.DeleteModal
        : Modals[`${this.entity}Modal`];
    }
  }
};
</script>
