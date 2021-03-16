<template>
  <q-card class="bg-transparent no-shadow no-border">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm ">
        <div v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-12 col-xs-12">
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none q-ml-xs">
            <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`" class=" q-pa-lg q-mr-none text-white">
              <q-icon :name="item.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="white" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    icon_position: {
      required: false,
      default: "left"
    },
    statistics:{
      required:true,
      type:Object
    }
  },
  computed: {
    items: function() {
      return this.icon_position === "left"
        && [
            {
              title: "Articoli",
              icon: "article",
              value: this.statistics.article,
              color1: "#5064b5",
              color2: "#3e51b5"
            },
            {
              title: "Clienti",
              icon: "face",
              value: this.statistics.customer,
              color1: "#f37169",
              color2: "#f34636"
            },
            {
              title: "Fatture",
              icon: "receipt_long",
              value: this.statistics.master,
              color1: "#ea6a7f",
              color2: "#ea4b64"
            },
            {
              title: "Ordini",
              icon: "unarchive",
              value: this.statistics.order,
              color1: "#a270b1",
              color2: "#9f52b1"
            }
          ]
    }
  }
};
</script>
