<template>
  <div id="app">
    <div class="container">
      <label>
        <input type="checkbox" v-model="config.useStore.value">
        Use Store VUEX?
      </label>
      <form @submit.prevent="handleSubmit">
        <div class="d-flex">
          <div>
            <label>
              <span class="d-block">Price</span>
              <input
                :value="form.fields.price.value"
                @input="(e) => { handleInputAnyField(e, 'price') }"
                type="number"
                min="1"
              >
              <span class="d-block">{{ form.fields.price.value }}</span>
            </label>
          </div>
          <div>
            <label>
              <span class="d-block">Quantity</span>
              <input
                :value="form.fields.quantity.value"
                @input="(e) => { handleInputAnyField(e, 'quantity') }"
                type="number"
                min="1"
              >
              <span class="d-block">{{ form.fields.quantity.value }}</span>
            </label>
          </div>
          <div>
            <label>
              <span class="d-block">Amount</span>
              <input
                :value="form.fields.amount.value"
                @input="(e) => { handleInputAnyField(e, 'amount') }"
                type="number"
                min="1"
              >
              <span class="d-block">{{ form.fields.amount.value }}</span>
            </label>
          </div>
          <div>
            <button role="button" type="submit">Submit</button>
            <div>
              <pre v-if="getStorageData">
                {{ getStorageData }}
              </pre>
              <span v-else>No data...</span>
            </div>
          </div>
        </div>
      </form>
      <div
        class="eventsFeed"
      >
        <div
          v-for="(eventItem, index) in eventsFeed"
          :key="index"
          class="eventsFeed_item"
        >
          <span class="d-block">{{ eventItem.type }}</span>
          <span class="d-block">{{ eventItem.info }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from './helpers/other'
import storeConstants from "./constants/storeConstants";

function setNewInputValue (fieldName, value) {
  this.form.fields[fieldName].value = value
  this.pushEventToFeed('input', `new ${fieldName} value is ${value}`)
}

const debouncedSetNewInputValue = debounce(setNewInputValue, 300)

export default {
  name: 'App',
  data: () => ({
    form: {
      valid: false,
      fields: {
        price: {
          value: ''
        },
        quantity: {
          value: ''
        },
        amount: {
          value: ''
        }
      }
    },
    config: {
      useStore: {
        value: false
      }
    },
    eventsFeed: [],
    nonce: 1
  }),
  computed: {
    ...mapGetters('checkout', ['getSavedProduct']),
    getStorageData () {
      const nonce = this.nonce
      const parsedState = this.config.useStore.value ? this.getSavedProduct : JSON.parse(localStorage.getItem('state'))
      if (!parsedState) return
      return {
        nonce,
        ...parsedState
      }
    }
  },
  methods: {
    handleInputAnyField (e, fieldName) {
      debouncedSetNewInputValue.call(this, fieldName, e.target.value)
    },
    handleSubmit () {
      const { price, quantity, amount } = this.form.fields
      const requestBody = {
        price,
        quantity,
        amount,
        nonce: this.nonce
      }
      const infoMessage = `
        request body: ${JSON.stringify(requestBody)},\n
        store state: ${ this.getStorageData ? JSON.stringify(this.getStorageData) : 'empty now' }
      `
      this.pushEventToFeed('submit', infoMessage)
      this.emitBackendAnswer(requestBody)
    },
    emitBackendAnswer (requestBody) {
      const buildInfoMessage = (isSuccess) => {
        return `
          success: ${isSuccess ? 'true': 'false'},\n
          request body: ${JSON.stringify(requestBody)},\n
          store state: ${ this.getStorageData ? JSON.stringify(this.getStorageData) : 'empty now' }
        `
      }
      setTimeout(() => {
        if (!(requestBody.amount.value % 2)) {
          if (this.config.useStore.value) {
            this.$store.commit(storeConstants.modules.CHECKOUT_MODULE.mutations.SET_SAVED_PRODUCT)
          } else {
            localStorage.setItem('state', JSON.stringify(requestBody))
          }

          this.nonce++
          this.pushEventToFeed('response', buildInfoMessage(true))
        } else {
          this.pushEventToFeed('response', buildInfoMessage(false))
        }
      }, 1000)
    },
    pushEventToFeed (type, info) {
      if (!type) return
      this.eventsFeed.unshift({
        type,
        info: info || ''
      })
    }
  },
  beforeCreate () {
    localStorage.removeItem('state')
  }
}
</script>

<style lang="css">
  .container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
  }
  .d-block {
    display: block;
  }
  .d-flex {
    display: flex;
  }
  .eventsFeed {
    margin-top: 40px;
  }
  .eventsFeed_item {
    margin-top: 10px;
  }

</style>
