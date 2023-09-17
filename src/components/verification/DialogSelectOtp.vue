<template lang="html">
  <v-dialog v-model="showDialog" persistent content-class="border-radius-10" max-width="350">
    <v-card class="p-relative">
      <v-btn icon class="btn-close-dialog" @click="closeDialog">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <div class="d-img-verificarion">
        <v-img :src="require('@/assets/img/png/use_whatsapp.png')" height="192" width="290" contain class="mx-auto" />
      </div>
      <div class="pa-4">
        <div class="font-14 line-height-normal">
          {{ $t('account.desc_otp_whatsapp', {'phone': phone}) }}
        </div>
        <v-btn block color="#6EBE46" dark depressed class="text-none border-radius-10 mt-4" @click="$emit('click-whatsapp')">
          {{ $t('account.use_otp_whatsapp') }}
        </v-btn>
        <v-btn block color="primary" text depressed class="text-none mt-2" @click="$emit('click-call')">
          {{ $t('account.miscall_now') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      default: false,
      type: Boolean
    },
    phone: {
      default: '',
      type: String
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', false)
    }
  }
}
</script>
