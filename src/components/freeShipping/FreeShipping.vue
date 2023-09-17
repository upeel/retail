<template lang="html">
  <div>
    <v-expand-transition>
      <div v-if="dataDelivery.enabled" class="primary free_shipping">
        <v-container>
          <v-row :class="[{ 'ma-0 fill-height': $vuetify.breakpoint.width > 600 }]">
            <v-col cols="12" :class="[{ 'pa-0': $vuetify.breakpoint.width > 600 }]">
              <div class="d-flex align-center">
                <div class="white--text d-flex align-center cursor-pointer" @click="handleDetailShipping">
                  <v-icon color="white" class="mr-2">
                    mdi-truck
                  </v-icon>
                  <span class="font-14">
                    {{ $t('product.free_shipping') }}
                  </span>
                </div>
                <v-spacer />
                <div>
                  <v-btn icon color="white" @click="handleDetailShipping">
                    <v-icon size="18">
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
    <dialog-detail-shipping v-model="dialog.detail_shipping" />
  </div>
</template>
<script>
import dialogDetailShipping from '@/components/freeShipping/DialogDetailShipping'
export default {
  name: 'FreeShipping',
  components: {
    dialogDetailShipping
  },
  data() {
    return {
      dataDelivery: {
        enabled: true
      },
      dialog: {
        detail_shipping: false
      }
    }
  },
  methods: {
    handleCloseFreeShipping() {
      this.dataDelivery.enabled = false
    },
    handleDetailShipping() {
      this.dialog.detail_shipping = true
    }
  }
}
</script>
