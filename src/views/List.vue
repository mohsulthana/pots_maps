<template>
<div id="list">
  <b-table id="my-table" responsive="sm" striped hover show-empty :fields="fields" :items="list" :current-page="currentPage" :per-page="perPage">
    <template #cell(date)="data">
      {{ data.item.from }} <br />
      <span class="date">  To  </span> <br />
      {{ data.item.to }}
    </template>
    <template #cell(name)="data" class="text-left text-weight-bold">
      <h6 class="text-left">
        <img v-if="data.item.logo === undefined" src="@/assets/image.png" alt="Default Logo" height="80" class="mr-3" />
        <img v-else :src="data.item.logo" height="80" class="rounded-circle mr-3" alt="Event logo" />
        {{ data.item.name }}
      </h6>
    </template>
    <template #cell(organizer)="data">
      <p>{{ data.value }}</p>
    </template>
    <template #cell(address)="data" class="text-left">
      {{ data.item.address }} <br />
      {{ data.item.postCode }} <br />
      {{ data.item.city }}
    </template>
    <template #cell(type)="data"> {{ data.item.type }} <br /> </template>
    <template #table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong> Loading...</strong>
      </div>
    </template>
  </b-table>
  <b-col sm="12" md="4" offset-md="4" class="my-1">
    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
  </b-col>
</div>
</template>

<script>
export default {
  props: {
    list: Array
  },
  data () {
    return {
      tabActive: false,
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      fields: ['date', 'name', 'organizer', 'address', 'type'],
      isBusy: false
    }
  },
  watch: {
    list: function (newVal, oldVal) {
      this.totalRows = this.list.length
    }
  },
  mounted () {
    this.$root.$on('bv::dropdown::show', (bvEvent) => {})
  }
}
</script>

<style lang="scss">
td>h6 {
  font-weight: 700;
  font-size: 1.3em;
}

.table-hover tbody tr:hover {
  color: #212529;
  background-color: rgba(0, 0, 0, 0.36) !important;
}

li>a {
  color: #660404;

  &:hover {
    color: #660404;
  }
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
