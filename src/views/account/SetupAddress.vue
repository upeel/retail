<template>
  <div class="pb-10">
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-btn icon class="mr-2" @click="goBack">
                <v-icon>
                  mdi-arrow-left
                </v-icon>
              </v-btn>
              <div class="font-18 font-weight-bold">
                {{ $t('account.add_shipping_address') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-container>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <ValidationObserver ref="observer">
            <ValidationProvider v-slot="{ errors }" name="name" rules="required">
              <div class="input-with-label">
                <v-text-field v-model="form.name" solo height="56" :placeholder="$t('account.placeholder_shippping_to')" :error-messages="errors" class="shadow-input" />
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="point_maps" rules="point_maps">
              <input type="hidden" :value="point_maps">
              <v-btn block large class="font-16 font-weight-bold border-radius-10 box-shadow-1 text-none" @click="sheet.select_location = true">
                Google Maps
              </v-btn>
              <div class="card-error-mesaage">
                <div v-if="errors.length > 0" class="card-wrap-error-message">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>
            <div v-if="form.lat !== 0 && form.lon !== 0" class="mb-4" style="z-index: 1; position: relative; border-radius: 10px; overflow: hidden;">
              <l-map ref="map_selected" v-resize="onResizeMap" style="height: 170px; width: 100%;" :zoom="16" :center="center_selected" :options="{ zoomControl: false, dragging: false }">
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-marker :lat-lng="markerLatLng_selected" />
              </l-map>
            </div>
            <ValidationProvider v-slot="{ errors }" name="address" rules="required">
              <div class="input-with-label">
                <label>
                  {{ $t('account.address') }}
                </label>
                <v-textarea v-model="form.address" solo rows="3" :error-messages="errors" :placeholder="$t('account.full_address')" class="shadow-input" />
              </div>
            </ValidationProvider>
            <div class="input-with-label">
              <v-textarea v-model="form.note" prepend-inner-icon="mdi-note-text" solo rows="3" :placeholder="$t('account.note_address')" class="shadow-input" />
            </div>
            <ValidationProvider v-slot="{ errors }" name="country_id" rules="required">
              <div class="input-with-label">
                <label>
                  {{ $t('account.country') }}
                </label>
                <v-select v-model="form.country_id" :items="countries" item-value="id" item-text="name" solo height="56" :error-messages="errors" class="shadow-input" @change="getState()" />
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="state_id" rules="required_if:country_id,ID">
              <div class="input-with-label">
                <label>
                  {{ $t('account.province') }}
                </label>
                <v-select v-model="form.state_id" :items="provinces" item-value="id" item-text="name" solo height="56" :error-messages="errors" class="shadow-input" @change="getCity(form.state_id)" />
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="city_id" rules="required_if:country_id,ID">
              <div class="input-with-label">
                <label>
                  {{ $t('account.city_or_district') }}
                </label>
                <v-select v-model="form.city_id" :items="cities" item-value="id" item-text="city" solo height="56" :error-messages="errors" class="shadow-input" @change="getSubdistrict(form.city_id)" />
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="subdistrict_id" rules="required_if:country_id,ID">
              <div class="input-with-label">
                <label>
                  {{ $t('account.sub_district') }}
                </label>
                <v-select v-model="form.subdistrict_id" :items="subdistricts" item-value="id" item-text="name" solo height="56" :error-messages="errors" class="shadow-input" />
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="postal_code" rules="required">
              <div class="input-with-label">
                <label>
                  {{ $t('account.postal_code') }}
                </label>
                <v-text-field v-model="form.postal_code" solo height="56" :error-messages="errors" class="shadow-input" />
              </div>
            </ValidationProvider>
            <div class="mb-4">
              <div class="d-flex align-center">
                <div class="font-16 font-weight-bold">
                  {{ $t('account.default_address') }}
                </div>
                <v-spacer />
                <v-switch v-model="form.is_default" :false-value="0" :true-value="1" hide-details class="mt-0 pt-0" />
              </div>
            </div>
            <div>
              <v-btn block color="primary" x-large class="text-none" @click="saveAddress()">
                {{ $t('account.save') }}
              </v-btn>
            </div>
          </ValidationObserver>
        </v-col>
      </v-row>
    </v-container>

    <v-bottom-sheet v-model="sheet.select_location" persistent :content-class="'showFull'">
      <v-sheet style="height: 100%; z-index: 2;">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
              <div class="font-18">
                <span class="font-weight-bold d-flex align-center">
                  {{ $t('component.shipping_address') }}
                  <v-spacer />
                  <v-icon class="black--text" @click="closeSheetSelectLocation()">
                    mdi-close
                  </v-icon>
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4" class="pa-0 p-relative">
              <div class="wrap-search-maps">
                <div class="card--input pa-0">
                  <!-- <v-autocomplete
                    v-model="place_id"
                    :items="list_address"
                    clearable
                    hide-details
                    flat
                    solo
                    dense
                    :loading="isLoading"
                    :search-input.sync="search"
                    hide-no-data
                    hide-selected
                    prepend-inner-icon="mdi-magnify"
                    item-text="description"
                    item-value="place_id"
                    placeholder="Search Location"
                  /> -->
                  <l-autocompleted
                    v-model="place_id"
                    :items="list_address"
                    height="56"
                    :open-menu="open_autocompleted"
                    item-text="description"
                    item-value="place_id"
                    no-border
                    offset-height="58"
                    @set-value-menu="getValueMenu"
                    @search-input="getValueAutocompleted"
                  />
                </div>
              </div>

              <l-map ref="map" v-resize="onResize" style="height: calc(100vh - 183px); width: 100%;" :zoom="16" :center="center" :options="{ zoomControl: false }">
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-marker :lat-lng="markerLatLng" draggable @update:lat-lng="updateCoordinates" />
              </l-map>
              <div class="menu__select-loacation">
                <div class="menu__select-loacation-wrapper">
                  {{ temporary.address }}
                </div>
              </div>
              <v-btn color="primary" x-large tile block class="text-none font-16 font-weight-bold" @click="nextAddress()">
                {{ $t('account.choose_this_location') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import L from 'leaflet'
import { debounce } from 'debounce'
import {
  autoComplete as autoCompleteMaps,
  placeDetail as placeDetailMaps,
  geoCodeByLatLng as geoCodeByLatLngMaps
} from '@/api/maps'
import {
  createAddress as createAddressUser
} from '@/api/customer'
import { listCountry, listState, listCity, listSubDistrict } from '@/api/global'
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'
import LAutocompleted from '@/components/autocompleted/Index'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    LAutocompleted
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      sheet: {
        select_location: true
      },
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      center: [0, 0],
      markerLatLng: [0, 0],
      center_selected: [0, 0],
      markerLatLng_selected: [0, 0],
      point_maps: [0, 0],
      autocompleteOptions: {
        componentRestrictions: {
          country: [
            'id'
          ]
        }
      },
      form: {
        name: '',
        address: '',
        country_id: '',
        state_id: '',
        city_id: '',
        subdistrict_id: '',
        postal_code: '',
        note: '',
        is_default: 0,
        lat: 0,
        lon: 0
      },
      countries: [],
      provinces: [],
      cities: [],
      subdistricts: [],
      temporary: {
        address: '',
        country_id: '',
        state_id: '',
        city_id: '',
        subdistrict_id: '',
        lat: 0,
        lon: 0
      },
      list_address: [],
      place_id: null,
      search: null,
      open_autocompleted: false,
      params_google: {
        types: 'geocode|establishment',
        radius: 500,
        location: '',
        components: encodeURIComponent('country:ID')
      }
    }
  },
  watch: {
    'place_id': function(newItem) {
      if (typeof newItem !== 'undefined') {
        this.selectAddress(newItem)
      }
    },
    search: debounce(async function(val) {
      this.list_address = []
      if (val && val !== '') {
        const params = {
          address: val,
          params: Object.keys(this.params_google).map(key => key + '=' + this.params_google[key]).join('&')
        }
        this.getListAddress(params)
        this.open_autocompleted = true
      } else {
        this.list_address = []
        this.open_autocompleted = false
      }
    }, 500)
    // search: debounce(async function(val) {
    //   if (val === null || val === '') {
    //     this.list_address = []
    //     return
    //   }
    //   if (this.isLoading) return
    //   this.isLoading = true
    //   const dataObj = {
    //     address: val
    //   }
    //   try {
    //     const { data } = await autoCompleteMaps(dataObj)
    //     this.list_address = await data.predictions
    //   } catch (e) {
    //     this.$store.dispatch('showAlert', {
    //       type: 'error',
    //       show: true,
    //       message: e.message,
    //       status_code: e.statusCode
    //     })
    //   } finally {
    //     this.isLoading = false
    //   }
    // }, 500)
  },
  mounted() {
    this.getLatLng()
    this.getCountry()
    this.getState()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'address' }).catch(() => {})
    },
    getValueAutocompleted(e) {
      this.search = e
    },
    getValueMenu(e) {
      this.open_autocompleted = e
    },
    async getListAddress(params) {
      if (!this.$isEmpty(params)) {
        try {
          const { data } = await autoCompleteMaps(params)
          data.predictions.map(item => {
            this.list_address.push(item)
          })
        } catch (e) {
          this.list_address = []
        }
      }
    },
    async selectAddress() {
      if (this.place_id) {
        try {
          const { data } = await placeDetailMaps(this.place_id)
          this.setPlace(data.result)
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async setPlace(place) {
      this.place_id = ''
      this.temporary.address = place.formatted_address
      await this.$refs.map.setCenter([place.geometry.location.lat, place.geometry.location.lng])
      this.markerLatLng = await L.latLng(place.geometry.location.lat, place.geometry.location.lng)
    },
    async saveAddress() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        try {
          await createAddressUser(this.form)
          const query = this.$route.query.redirect
          if (query) {
            this.$router.push({ name: query }).catch(() => {})
          } else {
            this.$router.push({ name: 'address' }).catch(() => {})
          }
        } catch (e) {
          this.$store.dispatch('showAlert', {
            type: 'error',
            show: true,
            message: e.message
          })
        }
      }
    },
    async getAddress(dataLocation) {
      try {
        const { data } = await geoCodeByLatLngMaps(dataLocation)
        return data
      } catch (e) {
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
        return ''
      }
    },
    setMarker(lat, lng) {
      this.temporary.lat = lat
      this.temporary.lon = lng
      const form = {
        lat: lat,
        lon: lng
      }
      this.getAddress(form).then(async(data) => {
        const contry_idx = data.results[0].address_components.findIndex((e) => { return e.types[0] === 'country' })
        if (contry_idx > -1) {
          this.temporary.country_id = data.results[0].address_components[contry_idx].short_name
        }
        if (this.temporary.country_id !== 'ID') {
          this.provinces = []
          this.cities = []
          this.subdistricts = []
        } else {
          const _this = this
          this.getState(this.temporary.country_id)
          this.checkIdAddress(data.results, this.provinces, 'name_gmaps').then(async(state_id) => {
            if (state_id) {
              _this.temporary.state_id = state_id
              await this.getCity(state_id)
              this.checkIdAddress(data.results, this.cities, 'city').then(async(city_id) => {
                if (city_id) {
                  _this.temporary.city_id = city_id
                  await this.getSubdistrict(city_id)
                  this.checkIdAddress(data.results, this.subdistricts, 'name').then(async(subdistrict_id) => {
                    if (subdistrict_id) {
                      _this.temporary.subdistrict_id = subdistrict_id
                    } else {
                      _this.temporary.subdistrict_id = ''
                    }
                  })
                } else {
                  _this.temporary.city_id = ''
                  this.subdistricts = []
                }
              })
            } else {
              _this.temporary.state_id = ''
              this.cities = []
              this.subdistricts = []
            }
          })
        }
        this.temporary.address = data.results[0].formatted_address
      })
    },
    async checkIdAddress(arrAddress, arrList, key = 'name') {
      var id = ''
      arrAddress.map(item => {
        const arr_state = item.formatted_address.split(', ')
        return arr_state.filter(function(val) {
          const state_idx = arrList.findIndex((e) => {
            return e[key] === val
          })
          if (state_idx > -1) {
            id = arrList[state_idx].id
          }
        })
      })
      return id
    },
    async nextAddress() {
      this.sheet.select_location = false
      this.form.country_id = this.temporary.country_id
      this.form.state_id = this.temporary.state_id
      this.form.city_id = this.temporary.city_id
      this.form.subdistrict_id = this.temporary.subdistrict_id
      this.form.lat = this.temporary.lat
      this.form.lon = this.temporary.lon
      // await this.$refs.map_selected.setCenter([this.temporary.lat, this.temporary.lon])
      this.center_selected = await L.latLng(this.temporary.lat, this.temporary.lon)
      this.markerLatLng_selected = await L.latLng(this.temporary.lat, this.temporary.lon)
      this.point_maps[0] = this.temporary.lat
      this.point_maps[1] = this.temporary.lon
      this.form.address = ''
    },
    async getLatLng() {
      if (!('geolocation' in navigator)) {
        console.log('Geolocation is not available.')
      }
      navigator.geolocation.getCurrentPosition(pos => {
        this.$refs.map.setCenter([pos.coords.latitude, pos.coords.longitude])
        this.markerLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude)
        this.params_google.location = encodeURIComponent(pos.coords.latitude + ', ' + pos.coords.longitude)
      }, () => {
        this.$store.state.block_location = true
      })
    },
    async updateCoordinates(location) {
      await this.setMarker(location.lat, location.lng)
    },
    onResizeMap() {
      this.$refs.map_selected.mapObject._onResize()
    },
    onResize() {
      this.$refs.map.mapObject._onResize()
    },
    closeSheetSelectLocation() {
      this.sheet.select_location = false
      if (this.form.country_id === '') {
        this.provinces = []
      }
    },
    async getCountry() {
      try {
        const params = {
          per_page: 240
        }
        const { data } = await listCountry(params)
        this.countries = data.data
      } catch (e) {
        this.countries = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async getState(country_id) {
      try {
        const params = {
          country_id: country_id,
          sort_type: 'asc',
          sort_column: 'name',
          per_page: 40
        }
        const { data } = await listState(params)
        this.provinces = data.data
      } catch (e) {
        this.provinces = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async getCity(state_id) {
      try {
        const params = {
          per_page: '500',
          sort_column: 'id',
          sort_type: 'desc',
          search_column: 'state_id',
          search_operator: '=',
          search_text: state_id
        }
        const { data } = await listCity(params)
        this.cities = data.data
      } catch (e) {
        this.cities = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    async getSubdistrict(city_id) {
      try {
        const params = {
          per_page: '500',
          sort_column: 'id',
          sort_type: 'desc',
          search_column: 'city_id',
          search_operator: '=',
          search_text: city_id
        }
        const { data } = await listSubDistrict(params)
        this.subdistricts = data.data
      } catch (e) {
        this.subdistricts = []
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    }
  }
}
</script>
