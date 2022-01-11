<template>
<div id="selection">
   <img src="@/assets/Logo-pot.png" alt="Pots Logo" class="tango-logo" height="70" />
    <img src="@/assets/UKATA.png" alt="Tango Association" class="ukata-logo" height="70" />
  <b-container fluid="xl" class="my-5">
    <h1 class="text-white display-2">Tango</h1>
    <b-row class="my-3">
      <b-col class="d-flex justify-content-center">
        <b-form-select v-model="selectedRegion" class="w-25 mx-2">
          <template #first>
            <b-form-select-option value="" disabled>Select region</b-form-select-option>
          </template>
          <b-form-select-option :value="value.key" v-for="(value, index) in sortedRegion" :key="index">{{ value.text }}</b-form-select-option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col class="d-flex justify-content-center">
        <multiselect class="w-25 mx-2" :multiple="true" placeholder="Select Type" v-model="typeSelectedFilter" :options="options" />
        <b-form-datepicker class="w-25 px-2" reset-button :min="min" placeholder="Select Date" id="example-datepicker" v-model="dateFromFilter" />
        <b-input-group class="w-25 px-2">
          <b-form-input v-model="cityFilter" placeholder="Enter city"></b-form-input>
          <b-input-group-append @click="clearCityFilter" style="cursor: pointer">
            <b-input-group-text>
              <b-icon-x />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
        <b-button @click="applyFilter()" :disabled="!regionIsSelected" variant="light"><b-icon-filter />Filter</b-button>
      </b-col>
      <!-- <b-col cols="3">
        <b-form-datepicker reset-button :min="min" id="example-datepicker" v-model="dateFromFilter" class="mb-2 w-75"></b-form-datepicker>
      </b-col>
      <b-col cols="3">
        <b-input-group class="w-75">
          <b-form-input v-model="cityFilter" placeholder="Enter the city"></b-form-input>
          <b-input-group-append @click="clearCityFilter" style="cursor: pointer">
            <b-input-group-text>
              <b-icon-x />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col cols="3">
                <b-button variant="outline-danger" @click="clearFilter()" style="border: none !important;">
          <b-icon-x />Clear filter
        </b-button>
      </b-col> -->
    </b-row>
  </b-container>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from '@/axios'

export default {
  props: {
    isMobile: Boolean,
    filtered: Boolean
  },
  data () {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return {
      min: today,
      regionIsSelected: false,
      selectedRegion: '',
      isBusy: false,
      dropdownItems: [],
      isRegionSelected: false,
      typeSelectedFilter: null,
      dateFromFilter: null,
      cityFilter: null,
      options: [
        'FESTIVAL',
        'MILONGA',
        'PRACTICA',
        'CLASS',
        'WORKSHOP',
        'MARATHON'
      ]
    }
  },
  methods: {
    applyFilter () {
      const type = this.typeSelectedFilter
      const daterange = this.dateFromFilter
      const city = this.cityFilter

      const obj = {
        cityFilter: city,
        dateFromFilter: daterange,
        typeSelectedFilter: type,
        selectedRegion: this.selectedRegion
      }

      this.$emit('getEventsFilter', obj)
    },
    capitalizeWord (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    clearFilter () {
      this.cityFilter = null
      this.dateFromFilter = null
      this.typeSelectedFilter = null
      this.$emit('getEvents', this.selectedRegion)
      this.$emit('removeFilterState', false)
    },
    clearCityFilter () {
      this.cityFilter = null
    },
    getDropdownItems () {
      axios.get('events/regions/GBR').then((response) => {
        for (const key in response.data.results) {
          if (Object.hasOwnProperty.call(response.data.results, key)) {
            const element = response.data.results[key]
            this.dropdownItems.push({
              key: key,
              text: element
            })
          }
        }
      }).finally(() => {
        this.tabActive = true
      })
    }
  },
  components: {
    Multiselect
  },
  computed: {
    sortedRegion () {
      const region = Object.assign([], this.dropdownItems)

      return region.sort(function (a, b) {
        const x = a.text.toLowerCase()
        const y = b.text.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      })
    }
  },
  watch: {
    selectedRegion: function (newValue, oldValue) {
      this.regionIsSelected = true
      this.selectedRegion = newValue
      this.cityFilter = null
      this.dateFromFilter = null
      this.typeSelectedFilter = null
      if (
        this.cityFilter === null ||
        this.dateFromFilter === undefined ||
        this.typeSelectedFilter === null
      ) {
        this.$emit('getEvents', this.selectedRegion)
      } else {
        this.$emit('getEventsFilter')
      }
    }
  },
  created () {
    this.getDropdownItems()
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
