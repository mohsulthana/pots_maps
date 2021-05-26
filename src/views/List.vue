<template>
  <b-container>
    <b-row>
      <b-col align="end">
        <b-icon-funnel font-scale="2.2" class="pt-1" />
        <b-dropdown text="Select Region">
          <b-dropdown-item v-for="(value, index) in dropdownItems" :key="index">{{ value.text }}</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>

    <b-tabs content-class="mt-3">
      <b-tab title="List View" active>
        <div class="row">
          <div class="col-lg">
            <h4>Please select your region...</h4>
            <div>
              <b-table
                responsive
                striped
                hover
                :busy="isBusy"
                :fields="fields"
                :items="list"
              >
                <template #cell(no)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(name)="data">
                  <p class="text-left">
                    <img
                      :src="data.item.logo"
                      height="80"
                      class="rounded"
                      alt="logoUrl"
                    />
                    {{ data.item.name }} <br />{{ data.item.type }}
                  </p>
                </template>
                <template #cell(organizer)="data">
                  <p>{{ data.value }}</p>
                </template>
                <template #cell(date)="data">
                  {{ data.item.date }} <br />
                  {{ data.item.address }}, {{data.item.city}}
                </template>
                <template #cell()="" style="display: none"> </template>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
              </b-table>
            </div>
          </div>
        </div>
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
      fields: ['no', 'name', 'organizer', 'date'],
      dropdownItems: [],
      isBusy: false
    }
  },
  components: {
    GoogleMapView
  },
  methods: {
    getDropdownItems () {
      axios.get('events/regions/GBR')
        .then((response) => {
          for (const key in response.data.results) {
            if (Object.hasOwnProperty.call(response.data.results, key)) {
              const element = response.data.results[key]
              this.dropdownItems.push({
                key: element,
                text: element
              })
            }
          }
        })
    },
    getEvents () {
      this.isBusy = true
      axios
        .get('events/local/GBR/ENG_GLN/1')
        .then((response) => {
          response.data.results.forEach((element) => {
            // logoUrl, name, from - to, city, address & postCode, type, associationName
            this.list.push({
              logo: element.logoUrl,
              name: element.name,
              organizer: element.associationName,
              date: `From: ${new Date(element.from.seconds).getDate()}/${
                new Date(element.from.seconds).getMonth() + 1
              } at ${new Date(element.from.seconds).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })} - To: ${new Date(element.to.seconds).getDate()}/${
                new Date(element.to.seconds).getMonth() + 1
              } at ${new Date(element.to.seconds).toLocaleString('en-US', {
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
        .finally(() => {
          this.isBusy = false
        })
    }
  },
  created () {
    this.getEvents()
    this.getDropdownItems()
  }
}
</script>
