<template>
  <b-container fluid>
    <b-row>
      <b-col align-self="end" offset-md="10" cols="2">
        <b-modal id="modal-1" title="BootstrapVue">
          <p class="my-4">Hello from modal!</p>
        </b-modal>
        <b-input-group>
          <!-- <b-input-group-prepend>
            <b-icon-funnel v-b-modal.modal-1 font-scale="2.2" class="pt-1" />
          </b-input-group-prepend> -->

          <b-form-select v-model="regionSelected">
            <!-- This slot appears above the options from 'options' prop -->
            <template #first>
              <b-form-select-option :value="null" disabled
                >-- Please select an option --</b-form-select-option
              >
            </template>
            <b-form-select-option
              :value="value.key"
              v-for="(value, index) in dropdownItems"
              :key="index"
              >{{ value.text }}</b-form-select-option
            >
          </b-form-select>
        </b-input-group>
      </b-col>
    </b-row>

    <b-tabs content-class="mt-3">
      <b-tab title="List View" active>
        <b-row align-h="center" v-if="regionSelected.length < 1">
          <b-col align-self="center">
            <h2 style="color: #660404; font-style: italic">Please select your region...</h2>
          </b-col>
        </b-row>
        <b-row v-else>
          <div class="col-lg">
            <div>
              <b-table
              id="my-table"
                responsive
                striped
                hover
                show-empty
                :busy="isBusy"
                :fields="fields"
                :items="list"
              >
                <template #cell(no)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(name)="data" class="text-left text-weight-bold">
                  <h6 class="text-left">
                    <img v-if="data.item.logo === undefined" src="@/assets/image.png" alt="Default Logo" height="80" class="mr-3">
                    <img
                    v-else
                      :src="data.item.logo"
                      height="80"
                      class="rounded-circle mr-3"
                      alt="Event logo"
                    />
                    {{ data.item.name }}
                  </h6>
                </template>
                <template #cell(organizer)="data">
                  <p>{{ data.value }}</p>
                </template>
                <template #cell(date)="data">
                  {{ data.item.date }} <br />
                  {{ data.item.address }}, {{ data.item.city }}
                </template>
                <template #cell(type)="data">
                  {{ data.item.type }} <br />
                </template>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
            </div>
          </div>
        </b-row>
      </b-tab>
      <b-tab title="Map View" lazy>
        <google-map-view :events="list" />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import axios from '@/axios'
import GoogleMapView from '../components/GoogleMap.vue'

export default {
  data () {
    return {
      list: [],
      fields: ['no', 'name', 'organizer', 'date', 'type'],
      dropdownItems: [],
      isBusy: false,
      regionSelected: '',
      isRegionSelected: false
    }
  },
  components: {
    GoogleMapView
  },
  computed: {},
  watch: {
    regionSelected: function (newValue, oldValue) {
      this.regionSelected = newValue
      this.getEvents()
    }
  },
  methods: {
    capitalizeWord (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    isOneWord (string) {
      return string.length > 0 && string.split('\\s+').length === 1
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
      })
    },
    getEvents () {
      this.isBusy = true
      axios
        .get(`events/ukata/GBR/${this.regionSelected}/1`)
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
              logo: element.logoUrl,
              name: element.name,
              organizer: element.associationName,
              from: `${new Date(timestampStarted).toLocaleString('en-US', dateFormatOptions)} at ${new Date(timestampStarted).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`,
              to: `${new Date(timestampEnded).toLocaleString('en-US', dateFormatOptions)} at ${new Date(timestampEnded).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`,
              date: `From: ${new Date(timestampStarted).toLocaleString('en-US', dateFormatOptions)} at ${new Date(timestampStarted).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })} - To: ${new Date(timestampEnded).toLocaleString('en-US', dateFormatOptions)} at ${new Date(timestampEnded).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`,
              address: `${element.address}, ${element.postCode}`,
              type: element.type,
              city: element.city
            })
          })
        })
        .catch((error) => {
          this.list = []
          console.log(error)
        })
        .finally(() => {
          this.$root.$emit('bv::refresh::table', 'my-table')
          this.isBusy = false
        })
    }
  },
  created () {
    this.getDropdownItems()
  },
  mounted () {
    this.$root.$on('bv::dropdown::show', (bvEvent) => {
      console.log('Dropdown is about to be shown', bvEvent)
    })
  }
}
</script>

<style scoped>
td > h6 {
  font-weight: 700;
  font-size: 1.3em;
}
</style>
