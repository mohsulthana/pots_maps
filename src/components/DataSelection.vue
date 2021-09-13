<template>
  <div id="selection">
    <b-container fluid>
      <b-row align-h="start">
        <b-col lg="2" sm="12" class="my-2">
          <multiselect
            :multiple="true"
            placeholder="Select Type"
            v-model="typeSelectedFilter"
            :options="options"
          >
          </multiselect>
        </b-col>
        <b-col lg="3" sm="12" class="my-2">
          <b-form-datepicker
            reset-button
            :min="min"
            id="example-datepicker"
            v-model="dateFromFilter"
            class="mb-2"
          ></b-form-datepicker>
        </b-col>
        <b-col lg="2" sm="12" class="my-2">
          <b-input-group>
            <b-form-input
              v-model="cityFilter"
              placeholder="Enter the city"
            ></b-form-input>
            <b-input-group-append
              @click="clearCityFilter"
              style="cursor: pointer"
            >
              <b-input-group-text>
                <b-icon-x />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col lg="2" sm="12" class="my-2">
          <b-button
            class="d-none d-lg-block"
            :disabled="selectedRegion.length < 1"
            @click="
              $emit('getEventsFilter', {
                cityFilter,
                typeSelectedFilter,
                dateFromFilter,
                selectedRegion,
              })
            "
            variant="danger"
            >Filter</b-button
          >
          <b-button
            style="width: 100%"
            class="d-lg-none"
            :disabled="selectedRegion.length < 1"
            @click="
              $emit('getEventsFilter', {
                cityFilter,
                typeSelectedFilter,
                dateFromFilter,
                selectedRegion,
              })
            "
            variant="danger"
            >Filter</b-button
          >
        </b-col>
        <b-col lg="2" sm="12" class="my-2">
          <b-button
            class="d-lg-none"
            variant="outline-danger"
            @click="clearFilter()"
            v-if="filtered"
          >
            <b-icon-x />Clear filter
          </b-button>

          <b-button
            class="d-none d-lg-block"
            variant="outline-danger"
            @click="clearFilter()"
            v-if="filtered"
            style="float: right"
          >
            <b-icon-x />Clear filter
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from '@/axios'

export default {
  props: {
    filtered: Boolean
  },
  data () {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return {
      min: today,
      selectedRegion: '',
      isBusy: false,
      dropdownItems: [],
      isRegionSelected: false,
      typeSelectedFilter: null,
      dateFromFilter: null,
      cityFilter: null,
      options: [
        'MILONGA',
        'PRACTICA',
        'CLASS',
        'WORKSHOP',
        'PRIVATE',
        'FESTIVAL',
        'RETREAT',
        'VACATION',
        'MARATHON'
      ]
    }
  },
  methods: {
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
      axios
        .get('events/regions/GBR')
        .then((response) => {
          for (const key in response.data.results) {
            if (Object.hasOwnProperty.call(response.data.results, key)) {
              const element = response.data.results[key]
              this.dropdownItems.push({
                key: key,
                text: element
              })
            }
          }
        })
        .finally(() => {
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
  }
}
</script>
