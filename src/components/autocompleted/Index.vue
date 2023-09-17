<template lang="html">
  <div :class="[contentClass, `laautocompleted p-relative`]">
    <div ref="iautocompleted">
      <v-text-field v-model="datasearch" hide-details outlined placeholder="Search Location" :height="height" clearable :class="[{ 'no-border': noBorder}]" @input="changeValue($event)" />
    </div>
    <div :class="[`lacontainer-menu`, { 'menu-active': openMenu }]" :style="{ top: topOffset + 'px'}">
      <div class="la-list">
        <template v-if="items.length !== 0">
          <div v-for="(item, idx) in items" :key="idx" class="la-list-item" @click="selectList(item)">
            <div class="la-list-item-content">
              <div class="la-list-item-text">
                {{ itemText !== '' ? item[itemText] : itemText }}
              </div>
            </div>
          </div>
        </template>
        <div v-else class="la-list-item no-data">
          <div class="la-list-item-content">
            <div class="la-list-item-text">
              No data available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: '',
      type: [Number, String]
    },
    openMenu: {
      default: false,
      type: Boolean
    },
    items: {
      default: () => [],
      type: Array
    },
    itemText: {
      default: '',
      type: String
    },
    itemValue: {
      default: '',
      type: String
    },
    height: {
      default: '',
      type: [Number, String]
    },
    contentClass: {
      default: '',
      type: String
    },
    noBorder: {
      default: false,
      type: Boolean
    },
    offsetHeight: {
      default: 0,
      type: [Number, String]
    }
  },
  data() {
    return {
      datasearch: null,
      top_menu: 0
    }
  },
  computed: {
    topOffset() {
      return Number(this.offsetHeight)
    }
  },
  methods: {
    changeValue(e) {
      this.$emit('search-input', e)
    },
    selectList(item) {
      this.datasearch = this.itemText !== '' ? item[this.itemText] : item
      this.$emit('set-value-menu', false)
      this.$emit('input', this.itemValue !== '' ? item[this.itemValue] : item)
    }
  }
}
</script>
<style>
.lacontainer-menu{
  position: absolute;
  right: 0px;
  left: 0px;
  width: 100%;
  display: inline-block;
  overflow-y: auto;
  overflow-x: hidden;
  contain: content;
  box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);
  border-radius: 4px;
  max-height: 0;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
  z-index: 999;
  background-color: #fff;
}
.lacontainer-menu.menu-active{
  max-height: 300px;
  transition: max-height 0.25s ease-in;
  overflow: auto;
}
.la-list {
  display: block;
  padding: 8px 0;
  position: static;
  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
}
.la-list-item{
  align-items: center;
  display: flex;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  padding: 0 16px;
  position: relative;
  text-decoration: none;
  cursor: pointer;
}
.la-list-item:before {
  background-color: currentColor;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: .3s cubic-bezier(.25,.8,.5,1);
}
.la-list-item:hover:before{
  opacity: .04;
}
.la-list-item.no-data{
  cursor: default;
}
.la-list-item.no-data:hover:before{
  opacity: 0;
}
.la-list-item-content{
  align-items: center;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  flex: 1 1;
  overflow: hidden;
  padding: 12px 0;
}
.la-list-item-text {
  flex: 1 1 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  white-space: normal !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}
.no-border fieldset {
  border: none !important;
}
</style>
