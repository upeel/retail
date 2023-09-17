<template lang="html">
  <v-dialog v-model="showDialog" persistent content-class="border-radius-10" max-width="350">
    <v-card class="p-relative">
      <v-btn icon class="btn-close-dialog" @click="closeDialog">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
      <div class="d-img-verificarion py-10">
        <v-img :src="require('@/assets/img/svg/Icon_awesome-check-circle.svg')" height="135" width="135" contain class="mx-auto" />
      </div>
      <div class="pa-4">
        <v-btn block color="primary" depressed class="text-none border-radius-10" @click="$emit('next')">
          {{ $t('account.continue') }}
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
      this.$emit('next')
    }
  }
}
</script>
