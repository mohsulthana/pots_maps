<template>
  <div>
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="12"
      style="width: 100%; height: 400px"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m"
        :clickable="true"
        @click="toggleInfoWindow(m, index)"
      ></gmap-marker>
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWindowOpen" @closeclick="infoWindowOpen=false" />
    </GmapMap>
  </div>
</template>

<script>
/* eslint-disable no-undef */

export default {
  name: 'GoogleMap',
  props: {
    events: Array
  },
  data () {
    return {
      infoOptions: {
        content: '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the ' +
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
      'south west of the nearest large town, Alice Springs; 450&#160;km ' +
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
      'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
      'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
      'Aboriginal people of the area. It has many springs, waterholes, ' +
      'rock caves and ancient paintings. Uluru is listed as a World ' +
      'Heritage Site.</p>' +
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
      '(last visited June 22, 2009).</p>' +
      '</div>' +
      '</div>',
        // optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35
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
  mounted () {
    // this.geolocate()
    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({ lat: 51.5060031, lng: -0.1003099 })
      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder()

      this.events.forEach((element) => {
        geocoder.geocode({ address: element.address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            // things should include
            // Logo ( field: logoURL)
            // Name ( field: name)
            // From / To (date and time) (fields: from & to)
            // City (field: city)
            // Address/PostCode: (fields: address & postCode)
            // Type (field: type (Show Description) )
            // Organizer name (field: associationName)
            const latitude = results[0].geometry.location.lat()
            const longitude = results[0].geometry.location.lng()

            // insert property to marker
            this.markers.push({
              lat: latitude,
              lng: longitude,
              organizer: element.organizer
            })
          }
        })
      })
    })
  },
  methods: {
    toggleInfoWindow (item, index) {
      this.infoOptions.content = item.organizer
      this.infoWindowPos = item
      this.infoWindowOpen = true

      // check if its the same marker that was selected if yes toggle
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
