<template>
  <div id="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Фильтры</span>

<!--        <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>-->
      </div>
      <div>
        <el-select v-model="meterValue" @change="setCoordinate" placeholder="Тип измерителя">
          <el-option
                  v-for="meter in meterTypes"
                  :key="meter.value"
                  :label="meter.label"
                  :value="meter.value">
          </el-option>
        </el-select>

        <span v-if="loader">Loading...</span>
        <el-select
                v-else-if="coordinates.length"
                v-model="coordinateValue"
                @change="setSerialNumber"
                class="cordinate"
                placeholder="Координаты станций"
        >
          <el-option
                  v-for="coordinate in coordinates"
                  :key="coordinate.id"
                  :label="coordinate.x + ' ' + coordinate.y + ' ' + coordinate.id"
                  :value="coordinate.id"
          />
        </el-select>


        <span v-if="serialLoader">Loading...</span>
        <el-select v-else-if="serialNumbers.length"
                   v-model="serialValue"
                   class="cordinate"
                   placeholder="Серийный номер"
        >
          <el-option
                  v-for="item in serialNumbers"
                  :key="item"
                  :label="item"
                  :value="item"
          />
        </el-select>

        <div v-if="serialValue" class="data-range">
          <span class="demonstration">Период</span>
          <el-date-picker
                  v-model="value2"
                  type="daterange"
                  align="right"
                  start-placeholder="От"
                  end-placeholder="До">
<!--            default-value="2010-10-01"    -->
          </el-date-picker>
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      loader: false,
      serialLoader: false,
      meterTypes: [{
        value: 'amk',
        label: 'АМК(мгновенные)'
      }, {
        value: 'arctic',
        label: 'Арктические станции'
      }, {
        value: 'sensor',
        label: 'Датчик элек. поля'
      }, {
        value: 'soil',
        label: 'Влажность почвы'
      }],
      coordinates: [],
      serialNumbers: [],
      meterValue: '',
      coordinateValue: '',
      serialValue: '',
      value2: ''
    }
  },
  methods: {
    setCoordinate(value) {
      this.clearCoordinate(true)
      this.clearSerialNumber(false)

      axios.get('http://localhost:3000/' + value)
              .then(res => this.coordinates = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.loader = false)
    },
    setSerialNumber(value) {
      this.clearSerialNumber(true)

      axios.get('http://localhost:3000/' + this.meterValue + value)
              .then(res => this.serialNumbers = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.serialLoader = false)

    },
    clearCoordinate(status) {
      this.coordinates = []
      this.coordinateValue = ''
      this.loader = status
    },
    clearSerialNumber(status) {
      this.serialNumbers = []
      this.serialValue = ''
      this.serialLoader = status
    }
  },
  components: {

  }
}
</script>

<style lang="scss">
#app {
  margin: 10px;

  .el-select {
    margin-right: 15px;
  }

  .data-range {
    margin-top: 20px;

    .demonstration {
      margin-right: 15px;
    }
  }
}
</style>
