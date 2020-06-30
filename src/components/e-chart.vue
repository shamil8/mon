<template>
    <div class="dashboard" ref="dashboard">
        <el-row>
            <el-col :span="24">
                <div id="gotobedbar"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import macarons from 'echarts/theme/macarons'

    export default {
        props: {
            text: {
              type: String,
              default: 'Средняя температура, °C'
            },
            subtext: {
                type: String,
                default: 'АМК(мгновенные)'
            },
            lineObj1: {
                type: Object,
                default: () => ({
                        name: '15412AMK-03',
                        dataX: ['2019-06-06 08:35', '2019-06-06 08:36', '2019-06-06 08:40'],
                        dataY: [22.4, 34.5, 18.45]
                    })
            },
            lineObj2: {
                type: Object,
                default: () => ({})
            },
            lineObj3: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                chart: null,
                option: {
                    title: {
                        text: this.text,
                        subtext: this.subtext,
                        left:'center',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'cross',
                        }
                    },
                    legend: {
                        data: [this.lineObj1.name, this.lineObj2.name],
                        orient: 'vertical',
                        left: 'right',
                        top: 'middle',
                        itemGap: 20
                    },
                    toolbox: {
                        show: true,
                        orient: 'horizontal', // 'horizontal' ¦ 'vertical'
                        x: 'right',
                        y: 'top',
                        color: ['#22bb22', '#1e90ff', '#4b0082', '#d2691e'],
                        feature: {
                            mark: {show: true},
                            dataView: {
                                show: true,
                                readOnly: false,
                                title: 'Просмотр данных',
                                lang: [this.subtext, 'Выход', 'Обновление']
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar', 'tiled'],
                                title: {
                                    line: "Линия",
                                    tiled: "Черепичные",
                                    bar: "Диаграмма",
                                }
                            },
                            restore: {show: true,  title: "Сброс"},
                            saveAsImage: {
                                show: true,
                                title: 'Сохранить график'
                            }
                        }
                    },
                    calculable: true,
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.lineObj1.dataX
                        }
                    ],
                    yAxis: [ {type: 'value'} ],
                    series: [
                        {
                            name: this.lineObj1.name,
                            type: 'line',
                            areaStyle: {normal: {}},
                            data: this.lineObj1.dataY
                        },
                        {
                            name: this.lineObj2.name,
                            type: 'line',
                            tiled : 'Общее количество',
                            areaStyle: {normal: {}},
                            data: this.lineObj2.dataY
                        },
                        {
                            name: this.lineObj3.name,
                            type: 'line',
                            areaStyle: {normal: {}},
                            data: this.lineObj3.dataY
                        }
                    ]
                }
            }
        },
        methods: {
            drawbar(id) {
                let o = document.getElementById(id)
                let height = document.documentElement.clientHeight
                height -= 120
                o.style.height= height + 'px'
                this.chart = echarts.init(o, 'macarons')
                this.chart.setOption(this.option)
            },
            fakeMethod() { macarons },
        },
        mounted() {
            this.$nextTick(function () {
                this.drawbar('gotobedbar')
                let that = this
                let resizeTimer = null
                window.onresize = function () {
                    if (resizeTimer) clearTimeout(resizeTimer)
                    resizeTimer = setTimeout(function () {
                        that.drawbar('gotobedbar')
                    }, 300)
                }
            })
        },
        watch: {
            'sidebar.collapsed': function () {
                this.chart = {}
                let that = this
                setTimeout(function () {
                    that.drawbar('gotobedbar')
                }, 300)
            },
        }
    }
</script>

<style scoped>
    #gotobedbar {
        width: 100%;
        min-height: 500px;
        margin-right: 15px;
    }
</style>
