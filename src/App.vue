<template>
  <div id="app">
    <b-overlay :show="isLoading" no-wrap></b-overlay>
    <!-- <b-navbar variant="faded" type="light">
      <b-navbar-brand href="https://pointsoftango.com" target="_blank">
        <img src="@/assets/Logo-pot.png" alt="Pots Logo" height="70" />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <img src="@/assets/UKATA.png" alt="Tango Association" height="70" />
      </b-navbar-nav>
    </b-navbar> -->
    <div id="body">
      <data-selection
        :isMobile="isMobile"
        @getEvents="getEvents"
        @getEventsFilter="getEventsFilter"
        @updateRegion="updateRegion"
        @removeFilterState="removeFilterState"
        :filtered="filtered"
      />
      <b-container fluid>
        <h2 style="color: #660404; font-style: italic" v-if="list.length == [] && !filtered">
          Please select your region...
        </h2>
        <b-tabs>
          <b-tab title="List View">
            <list :list="list" :selectedRegion="region"/>
          </b-tab>
          <b-tab
            title="Map View"
            :active="tabActive"
            :disabled="list.length == 0"
          >
            <google-map-view :events="list" />
          </b-tab>
        </b-tabs>
      </b-container>
    </div>
  </div>
</template>

<script>
import List from '@/views/List.vue'
import axios from '@/axios'
import DataSelection from './components/DataSelection.vue'
import GoogleMapView from '@/components/GoogleMap.vue'

export default {
  data () {
    return {
      isLoading: false,
      list: [],
      tabActive: false,
      filtered: false,
      isMobile: false,
      isTablet: false,
      region: null
    }
  },
  components: {
    List,
    DataSelection,
    GoogleMapView
  },
  methods: {
    updateRegion (args) {
      this.region = args
    },
    resizeWindow () {
      if (window.innerWidth < 1024) {
        this.isMobile = true
        this.isTablet = false
      } else if (window.innerWidth > 1023 && window.innerWidth < 1201) {
        this.isTablet = true
        this.isMobile = false
      } else {
        this.isTablet = true
      }
    },
    removeFilterState (bool) {
      this.filtered = bool
    },
    isOneWord (string) {
      return string.length > 0 && string.split('\\s+').length === 1
    },
    getEventsFilter (evt) {
      this.isBusy = true
      this.list = []

      const body = {
        city: evt.cityFilter,
        from: new Date(evt.dateFromFilter).getTime() / 1000,
        types: evt.typeSelectedFilter
      }

      axios
        .post(`events/filter/ukata/GBR/${evt.selectedRegion}`, body)
        .then((response) => {
          const dateFormatOptions = {
            month: '2-digit',
            day: '2-digit'
          }
          response.data.results.forEach((element) => {
            const timestampStarted =
              (element.from.seconds + element.from.nanos) * 1000
            const timestampEnded =
              (element.to.seconds + element.to.nanos) * 1000

            if (element.type === 'MILONGA_CLASS') {
              element.type = 'Milonga & Class/Workshop'
            }
            if (element.type === 'PRACTICA_CLASS') {
              element.type = 'Practica & Class/Workshop'
            }
            if (element.type === 'FESTIVAL_MARATHON') {
              element.type = 'Festival / Marathon'
            }
            if (element.type === 'FESTIVAL_CHAMPIONSHIP') {
              element.type = 'Festival / Championship'
            }

            if (this.isOneWord(element.type)) {
              element.type =
                element.type.charAt(0).toUpperCase() +
                element.type.slice(1).toLowerCase()
            }

            // logoUrl, name, from - to, city, address & postCode, type, associationName
            this.list.push({
              id: element.id,
              country: element.country,
              cancelled: element.cancelled,
              logo: element.logoUrl,
              name: element.name,
              organizer: element.associationName,
              from: `${new Date(timestampStarted).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampStarted).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}`,
              to: `${new Date(timestampEnded).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampEnded).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}`,
              date: `From: ${new Date(timestampStarted).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampStarted).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric'
              })} - To: ${new Date(timestampEnded).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampEnded).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`,
              address: `${element.address}`,
              type: element.type,
              city: element.city,
              postCode: element.postCode,
              location: element.location
            })
          })
        })
        .catch((error) => {
          this.list = []
          console.error(error)
        })
        .finally(() => {
          this.$root.$emit('bv::refresh::table', 'my-table')
          this.isBusy = false
          this.totalRows = this.list.length
          this.filtered = true
        })
    },
    getEvents (region) {
      this.isBusy = true
      this.list = []

      axios
        .get(`events/ukata/GBR/${region}/1`)
        .then((response) => {
          const dateFormatOptions = {
            month: '2-digit',
            day: '2-digit'
          }
          response.data.results.forEach((element) => {
            const timestampStarted =
              (element.from.seconds + element.from.nanos) * 1000
            const timestampEnded =
              (element.to.seconds + element.to.nanos) * 1000

            if (element.type === 'MILONGA_CLASS') {
              element.type = 'Milonga & Class/Workshop'
            }
            if (element.type === 'PRACTICA_CLASS') {
              element.type = 'Practica & Class/Workshop'
            }
            if (element.type === 'FESTIVAL_MARATHON') {
              element.type = 'Festival / Marathon'
            }
            if (element.type === 'FESTIVAL_CHAMPIONSHIP') {
              element.type = 'Festival / Championship'
            }

            if (this.isOneWord(element.type)) {
              element.type =
                element.type.charAt(0).toUpperCase() +
                element.type.slice(1).toLowerCase()
            }

            // logoUrl, name, from - to, city, address & postCode, type, associationName
            this.list.push({
              id: element.id,
              cancelled: element.cancelled,
              country: element.country,
              logo: element.logoUrl,
              name: element.name,
              organizer: element.associationName,
              from: `${new Date(timestampStarted).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampStarted).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}`,
              to: `${new Date(timestampEnded).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampEnded).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
              })}`,
              date: `From: ${new Date(timestampStarted).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampStarted).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric'
              })} - To: ${new Date(timestampEnded).toLocaleString(
                'en-GB',
                dateFormatOptions
              )} at ${new Date(timestampEnded).toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`,
              address: `${element.address}`,
              type: element.type,
              city: element.city,
              postCode: element.postCode,
              location: element.location
            })
          })
        })
        .catch((error) => {
          this.list = []
          console.error(error)
        })
        .finally(() => {
          this.$root.$emit('bv::refresh::table', 'my-table')
          this.isBusy = false
          this.totalRows = this.list.length
        })
    }
  },
  mounted () {
    this.resizeWindow()
    window.addEventListener('resize', this.resizeWindow)
  },
  created () {
    axios.interceptors.request.use(
      (successfulReq) => {
        this.isLoading = true
        return successfulReq
      },
      (error) => {
        this.isLoading = true
        return Promise.reject(error)
      }
    )

    axios.interceptors.response.use(
      (successRes) => {
        this.isLoading = false
        return successRes
      },
      (error) => {
        this.isLoading = false
        Promise.reject(error)
      }
    )
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeWindow)
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&family=Ubuntu:wght@700&display=swap');
@import "assets/custom.scss";

#app {
  font-family: 'Source Sans Pro', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
/* selected: multiselect__option--selected# */
.multiselect__option.multiselect__option--highlight,
.multiselect__option--highlight::after,
.multiselect__tag,
.multiselect__tag-icon:after,
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: #660404 !important;
  color: white !important;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
.page-item.active .page-link {
  background: #660404;
  border-color: #660404;
}
.page-link {
  color: #660404;
}
.gm-style-iw-d {
  overflow: auto !important;
}
</style>
