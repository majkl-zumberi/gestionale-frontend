<template>
  <q-page padding>
    <q-card>
      <div class="box-ribbon-wrapper q-pt-xs">
        <q-toolbar class="text-white q-my-md">
          <q-ribbon
            position="left"
            color="rgba(0,0,0,.58)"
            background-color="#00588d"
            leaf-color="#a0a0a0"
            leaf-position="bottom"
            decoration="rounded-out"
          >
            <q-toolbar-title class="example-title">
              <q-btn
                flat
                round
                dense
                icon="control_point"
                class="q-mr-sm"
                size="md"
                color="white"
                @click="() => openNewArticleModal(undefined, `Measure`, 'add')"
              />
              <q-btn color="white" stretch flat label="nuova misura" />
            </q-toolbar-title>
          </q-ribbon>
        </q-toolbar>
      </div>
      <q-card-section>
        <q-table
          flat
          title="unità di misura"
          :data="measures"
          :columns="columns"
          :filter="filter"
          row-key="name"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Cerca"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                size="sm"
                round
                dense
                color="primary"
                icon="edit"
                @click.stop="
                  () => openNewArticleModal(props.row.id, 'Measure', 'edit')
                "
                class="q-mr-xs"
              />
              <q-btn
                size="sm"
                round
                dense
                color="secondary"
                icon="delete"
                @click.stop="
                  () =>
                    openNewArticleModal(
                      props.row.id,
                      'measure-unit',
                      'delete',
                      props.row,
                      props.row.name
                    )
                "
                class="q-mr-sm"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import crudModal from "../../components/modals/CrudModal";
import eventBus from "../../utils/eventBus";
export default {
  name: "measuresList",
  components: {},
  data() {
    return {
      columns: [
        {
          name: "code",
          label: "Codice",
          type: "string",
          field: measure => measure.code
        },
        {
          name: "name",
          label: "Nome",
          type: "string",
          field: measure => measure.description
        },
        {
          name: "actions",
          label: "Azioni",
          type: "actions"
        }
      ],
      measures: [],
      filter: ""
    };
  },
  methods: {
    openNewArticleModal: function(id, entity, action, item, title = "") {
      this.$q.dialog({
        component: crudModal,
        id: id,
        entity: entity,
        action: action,
        item: item,
        title: title,
        parent: this
      });
    },
    updateList(newArticle) {
      this.measures.splice(this.measures.length, 0, newArticle);
    },
    removeArticleFromList(articleId) {
      const idx = this.measures.findIndex(el => el.id === articleId);
      this.measures.splice(idx, 1);
    },
    updateArticle(articleToUpdate) {
      const idx = this.measures.findIndex(el => el.id === articleToUpdate.id);
      this.measures.splice(idx, 1, articleToUpdate);
    }
  },
  created: function() {
    axios.get("http://localhost:3000/measure-unit").then(res => {
      this.measures = res.data;
    });

    eventBus.$on("items-changed", this.updateList);
    eventBus.$on("item-delete", this.removeArticleFromList);
    eventBus.$on("items-update", this.updateArticle);
  },
  beforeDestroy: function() {
    eventBus.$off("items-changed", this.updateList);
    eventBus.$off("item-delete", this.removeArticleFromList);
    eventBus.$off("items-update", this.updateArticle);
  }
};
</script>

<style scoped></style>
