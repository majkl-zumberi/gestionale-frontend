<template>
  <q-layout view="lHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Gestionale 2.0
        </q-toolbar-title>

        <div>Copyright reserved</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">

        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "Dashboard",
    caption: "Gestione Andamento",
    icon: "dashboard",
    link: "/#/dashboard"
  },
  {
    title: "Articoli",
    caption: "Gestione Articoli",
    icon: "article",
    link: "/#/articles"
  },
  {
    title: "Clienti",
    caption: "Gestione Clienti",
    icon: "face",
    link: "/#/customers"
  },
  {
    title: "Fatture",
    caption: "Gestione Fatture",
    icon: "receipt_long",
    link: "/#/invoices"
  },
  {
    title: "Ordini",
    caption: "Gestione Ordini",
    icon: "unarchive",
    link: "/#/orders"
  },
  {
    title: "Unità di misura",
    caption: "Gestione Unità di Misura",
    icon: "straighten",
    link: "/#/measures"
  },
  {
    title: "Categorie",
    caption: "Gestione categorie",
    icon: "category",
    link: "/#/categories"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  }
};
</script>
