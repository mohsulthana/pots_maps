<template>
<div id="selection">
  <img src="@/assets/Logo-pot.png" alt="Pots Logo" class="tango-logo" height="70" />
  <img src="@/assets/UKATA.png" alt="Tango Association" class="ukata-logo" height="70" />
  <h1 class="display-3" style="color: rgba(102, 4, 4, 0.9) !important;">UK Tango Map</h1>
  <div class="is-mobile" v-if="isMobile">
    <b-container>
      <b-row class="my-2">
        <b-col class="d-flex justify-content-center">
          <b-form-select v-model="selectedRegion">
            <template #first>
              <b-form-select-option value="" disabled>Select region</b-form-select-option>
            </template>
            <b-form-select-option :value="value.key" v-for="(value, index) in sortedRegion" :key="index">{{ value.text }}</b-form-select-option>
          </b-form-select>
        </b-col>
      </b-row>
      <hr class="separator">
      <b-row class="my-2">
        <b-col col class="d-flex justify-content-center">
          <multiselect :multiple="true" placeholder="Select Type" v-model="typeSelectedFilter" :options="options" />
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col sm="12" md="6" class="d-flex justify-content-center my-2">
          <b-form-datepicker reset-button :min="min" placeholder="Select Date" id="example-datepicker" v-model="dateFromFilter" />
        </b-col>
        <b-col sm="12" md="6" class="d-flex justify-content-center my-2">
          <b-input-group>
            <b-form-input v-model="cityFilter" placeholder="Enter city"></b-form-input>
            <b-input-group-append @click="clearCityFilter" style="cursor: pointer">
              <b-input-group-text>
                <b-icon-x />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
          </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col lg="6" sm="6" md="6" xl="auto" class="d-flex justify-content-center my-2">
          <b-button style="width: 100%" @click="applyFilter()" :disabled="!regionIsSelected" variant="light">
            <b-icon-filter />Filter
          </b-button>
        </b-col>
        <b-col lg="6" sm="6" md="6" xl="auto" class="d-flex justify-content-center my-2">
          <b-button style="width: 100%" @click="clearFilter()" variant="light">
            Clear Filter
          </b-button>
        </b-col>
      </b-row>
    <hr class="separator">
    </b-container>
  </div>
  <div class="is-tablet" v-else>
    <b-container fluid="xl" class="my-5">
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
          <b-button @click="applyFilter()" :disabled="!regionIsSelected" variant="light">
            <b-icon-filter />Filter
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from '@/axios'

export default {
  props: {
    isMobile: Boolean,
    isTablet: Boolean,
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
      this.$emit('updateRegion', newValue)
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
