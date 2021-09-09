<template>
  <div>
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="12"
      id="mapId"
      style="width: 100%; height: 600px"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m"
        :clickable="true"
        @click="toggleInfoWindow(m, index)"
      ></gmap-marker>
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWindowOpen"
        @closeclick="infoWindowOpen = false"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  props: {
    events: Array
  },
  data () {
    return {
      organizer: '',
      infoOptions: {
        // content: "<div style='float:left'><img src='http://i.stack.imgur.com/g672i.png'></div><div style='float:right; padding: 10px;'><b>Title</b><br/>123 Address<br/> City,Country</div>",
        content: '',
        // optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: 0
        }
      },
      currentMidx: null,
      infoWindowPos: null,
      infoWindowOpen: false,
      center: { lat: 51.5060031, lng: -0.1003099 },
      markers: [],
      address: [],
      currentPlace: null
    }
  },
  watch: {
    events: function (newVal, oldVal) {
      this.markers = []
      this.populateMap()
    }
  },
  mounted () {
    this.$refs.mapRef.$mapPromise.then((map) => {
      this.markers = []
      this.events.forEach((element) => {
        if (element.location !== undefined) {
          map.panTo({ lat: element.location.latitude, lng: element.location.longitude })
          this.center = {
            lat: element.location.latitude,
            lng: element.location.longitude
          }
          this.markers.push({
            lat: element.location.latitude,
            lng: element.location.longitude,
            name: element.name,
            type: element.type,
            logo: element.logo,
            organizer: element.organizer,
            from: element.from,
            to: element.to,
            address: element.address,
            city: element.city
          })
        }
      })
    })
  },
  methods: {
    populateMap () {
      this.$refs.mapRef.$mapPromise.then((map) => {
        this.markers = []
        this.events.forEach((element) => {
          if (element.location !== undefined) {
            map.panTo({ lat: element.location.latitude, lng: element.location.longitude })
            this.center = {
              lat: element.location.latitude,
              lng: element.location.longitude
            }
            this.markers.push({
              lat: element.location.latitude,
              lng: element.location.longitude,
              name: element.name,
              type: element.type,
              logo: element.logo,
              organizer: element.organizer,
              from: element.from,
              to: element.to,
              address: element.address,
              city: element.city
            })
          }
        // geocoder.geocode({ address: element.address }, (results, status) => {
        //   if (status === google.maps.GeocoderStatus.OK) {
        //     const latitude = results[0].geometry.location.lat()
        //     const longitude = results[0].geometry.location.lng()
        //     // insert property to marker
        //     this.markers.push({
        //       lat: latitude,
        //       lng: longitude,
        //       name: element.name,
        //       type: element.type,
        //       logo: element.logo,
        //       organizer: element.organizer,
        //       from: element.from,
        //       to: element.to,
        //       address: element.address,
        //       city: element.city
        //     })
        //   }
        // })
        })
      })
    },
    toggleInfoWindow (item, index) {
      const defaultImage = require('../assets/image.png')
      this.infoOptions.content = `
        <div class="card">
          <div class="card-body">
            <div style="float: left;">
              ${item.logo === undefined ? `<img src="${defaultImage}" alt="Default Logo" height="80" class="mr-3">` : `<img src=${item.logo} height="80" class="rounded-circle">`}
            </div>
            <div style="float: left;">
                <h4>${item.name}</h4>
                <p class="font-weight-bold"> ${item.type}</p>
                <p class="font-weight-bold">${item.from} - ${item.to}</p>
                <h6>${item.organizer}</h6>
                <h6>${item.address} - ${item.city}</h6>
            </div>
          </div>
        </div>
      `
      this.infoWindowPos = item
      this.infoWindowOpen = true

      // check if it's the same marker that was selected if yes toggle
      if (this.currentMidx === index) {
        this.infoWindowOpen = !this.infoWindowOpen
        // eslint-disable-next-line brace-style
      }

      // if different marker set infowindow to open and reset current marker index
      else {
        this.infoWindowOpen = true
        this.currentMidx = index
      }
    },
    setPlace (place) {
      this.currentPlace = place
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
  }
}
</script>

<style>
.card,
.gm-style .gm-style-iw-c,
.gm-style-iw-t::after {
  background-color: #660404 !important;
  color: white;
}
.card {
  border: none !important;
}
.gm-style-iw-t {
  right: 0px;
  bottom: 55px !important;
}
</style>
