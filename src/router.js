import Vue from 'vue'
import VueRouter from 'vue-router'
import CheckStore from './middleware/check-store'
import { getToken } from '@/utils/auth'

import Home from '@/views/Home'
import Login from '@/views/auth/Login'
import Register from '@/views/auth/Register'
import Account from '@/views/account/Detail'
import Profile from '@/views/account/Profile'
import Address from '@/views/account/Address'
import SetupAddress from '@/views/account/SetupAddress'
import DetailAddress from '@/views/account/DetailAddress'
import TermsConditions from '@/views/TermsConditions'
import Blank from '@/views/layout/Blank'
import Orders from '@/views/order/Orders'
import Order from '@/views/order/Order'
import ProductDetail from '@/views/product/DetailProduct'
import ShoppingCart from '@/views/cart/ShoppingCart'
import PaymentMethod from '@/views/payment/PaymentMethod'
import CheckStatus from '@/views/CheckStatus'
import OrderFailed from '@/views/OrderFailed'
import OrderSuccess from '@/views/OrderSuccess'
import OrderCancelled from '@/views/OrderCancelled'
import OrderPaymentPending from '@/views/OrderPaymentPending'
import OrderPaymentFailed from '@/views/OrderPaymentFailed'
import VAOrder from '@/views/VAOrder'
import About from '@/views/About'
import { store } from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/terms-conditions', name: 'terms_conditions', component: TermsConditions },
  {
    path: '/account',
    name: 'account',
    component: Blank,
    redirect: { name: 'account_detail' },
    children: [
      { path: 'detail', name: 'account_detail', component: Account },
      { path: 'profile', name: 'profile', component: Profile },
      { path: 'order', name: 'orders', component: Orders },
      { path: 'order/:id', name: 'order', component: Order },
      { path: 'address/add', name: 'add_address', component: SetupAddress },
      { path: 'address/:id', name: 'detail_address', component: DetailAddress },
      { path: 'address', name: 'address', component: Address }
    ]
  },
  { path: '/detail/:product_type/:id', name: 'product_detail', component: ProductDetail },
  { path: '/cart', name: 'shopping_cart', component: ShoppingCart },
  { path: '/cart/payment', name: 'payment_method', component: PaymentMethod },
  { path: '/cart/payment/check', name: 'check_status', component: CheckStatus },
  { path: '/cart/payment/failed', name: 'order_failed', component: OrderFailed },
  { path: '/cart/payment/success', name: 'order_success', component: OrderSuccess },
  { path: '/cart/payment/cancelled', name: 'order_cancelled', component: OrderCancelled },
  { path: '/cart/payment/payment-pending', name: 'order_payment_pending', component: OrderPaymentPending },
  { path: '/cart/payment/payment-failed', name: 'order_payment_failed', component: OrderPaymentFailed },
  { path: '/cart/payment/virtual-account', name: 'va_order', component: VAOrder },
  { path: '/account/order/:id/va_payment', name: 'va_payment', component: VAOrder },
  // space new route
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

const authlink = [
  'login',
  'register'
]

const accountlink = [
  'shopping_cart',
  'profile',
  'orders'
]

router.beforeEach(async(to, from, next) => {
  await store.dispatch('checkDomain')
  const auth_data = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_auth_data'))
  const token = getToken()
  if (!auth_data || isEmpty(auth_data) || !token || typeof token === 'undefined') {
    await store.dispatch('fetchToken')
  }
  await CheckStore()

  if (auth_data !== null) {
    if (auth_data.auth_by === 'BASIC') {
      if (authlink.indexOf(to.name) !== -1) {
        if (to.query.redirect) {
          next({ name: to.query.redirect })
        } else {
          next({ name: 'home' })
        }
      } else {
        next()
      }
    } else if (auth_data.auth_by === 'GUEST') {
      next()
    } else {
      // if auth true
      if (authlink.indexOf(to.name) !== -1) {
        next()
      } else if (accountlink.indexOf(to.name) !== -1) {
        if (isEmpty(to.params)) {
          next({ name: 'login', query: { redirect: to.name }})
        } else {
          if (to.name === 'order') {
            if (store.state.selected_store.setting.no_auth_dinein === 1) {
              next()
            } else {
              next({ name: 'login', query: { redirect: 'order', id: to.params.id }})
            }
          } else {
            next({ name: 'login', query: { redirect: 'home' }})
          }
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})
export default router
