<template>
  <div id="app">
    <h1 class="h1-app">Система климатического мониторинга &#174;</h1>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="meterValue" @change="setCoordinate" placeholder="Тип измерителя">
          <el-option
                  v-for="meter in meterTypes"
                  :key="meter.value"
                  :label="meter.label"
                  :value="meter.value">
          </el-option>
        </el-select>

        <span v-if="loader">Загрузка...</span>
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

        <span v-if="serialLoader">Загрузка...</span>
        <el-select v-else-if="serialNumbers.length"
                   v-model="serialValue"
                   class="cordinate"
                   placeholder="Серийный номер"
                   @change="setGraph"
        >
          <el-option
                  v-for="item in serialNumbers"
                  :key="item.serial"
                  :label="item.serial"
                  :value="item.serial"
          />
        </el-select>
      </div>
      <div v-if="serialValue">
        <span class="p-app">Сравнения и фильтры</span>
        <p>Сравнить с значениями других приборов</p>
        <el-radio-group v-model="line2" @change="addLine">
          <el-radio v-for="item in serialNumbers"
                    :label=item.serial
                    :key="item.serial"
                    :disabled="item.serial === serialValue"
          />
        </el-radio-group>
      </div>
    </el-card>

    <span v-if="chartLoader">Загрузка графика (большие данные)...</span>
    <e-chart v-else-if="serialValue"
             class="e-chart"
             :line-obj1="{name: serialValue, dataX: lineObj1.date, dataY: lineObj1.dataY}"
             :line-obj2="{name: line2, dataX: lineObj2.date, dataY: lineObj2.dataY}"
    />

  </div>
</template>

<script>
  import axios from 'axios'
  import eChart from './components/e-chart'

  const url = 'https://json-server.adib.vercel.app/'

export default {
  name: 'App',
  data() {
    return {
      loader: false,
      serialLoader: false,
      chartLoader: false,
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
      lineObj1: {},
      lineObj2: {},
      meterValue: '',
      coordinateValue: '',
      serialValue: '',
      line2: ''
    }
  },
  methods: {
    setCoordinate(value) {
      this.clearCoordinate(true)
      this.clearSerialNumber(false)

      axios.get(url + value)
              .then(res => this.coordinates = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.loader = false)
    },
    setSerialNumber(value) {
      this.clearSerialNumber(true)

      axios.get(url + this.meterValue + value)
              .then(res => this.serialNumbers = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.serialLoader = false)

    },
    setGraph(value) {
      this.clearChart(true)
      this.line2 = value

      axios.get(url + this.serialValue)
              .then(res => this.lineObj1 = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.chartLoader = false)
    },
    addLine(value) {
      this.lineObj2 = {}
      this.chartLoader = true

      axios.get(url + value)
              .then(res => this.lineObj2 = res.data)
              .catch(err => err.response && console.log(err.response.status))
              .then(() => this.chartLoader = false)
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
    },
    clearChart(status) {
      this.lineObj1 = {}
      this.chartLoader = status
    }
  },
  components: {
    eChart
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

  // Chart style
  .e-chart {
    margin-top: 20px;
  }

  .h1-app {
    font-weight: 400;
    color: #1f2f3d;
  }
  .p-app {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
}
</style>
