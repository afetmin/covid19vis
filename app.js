
let currentLanguage = 'zh';
let allDataStore = {};
let mapDisplayMetrics = 'current';
let chartsContainerId = 'chart_container';
let allCharts = [];
const build_timestamp='1585549136994';
const languageMap = {
  '总体趋势': 'Summary',
  '新增概览': 'Increasements',
  '省市趋势': 'Provinces Trends',
  '省市地图': 'Provinces Map',
  '全部城市地图': 'All Cities Map',
  '世界地图': 'World Map',
  '数据来源': 'Data Source',
  '各国趋势': 'World Trends',
  '最后更新时间：': 'Last Update: ',
  '其他': 'Others',
  '当前显示累计确诊': 'Display Total Confirmed',
  '当前显示现存确诊': 'Display Exists Confirmed',
  '确诊人数：': 'Confirmed: ',
  '治愈人数：': 'Cured: ',
  '死亡人数：': 'Dead: ',
  '新增确诊：': 'New Confirmed: ',
  '暂无数据': 'N/A',
  '治愈': 'Cured',
  '死亡': 'Dead',
  '治疗': 'Treating',
  '新增确诊': 'Confirmed Incr.',
  '无新增确诊天数': 'Zero Incr. Days',
  '治愈/死亡率': 'Cured/Dead Rate',
  '累计死亡率': 'Accum. Dead Rate',
  '累计治愈率': 'Accum. Cured Rate',
  '新增死亡率': '',
  '累计疑似': 'Total Suspected',
  '累计确诊': 'Total Confirmed',
  '当前疑似': 'Exists Suspected',
  '新增疑似': 'Suspected Incr.',
  '疑似确诊比例': 'Suspected Confirmed Rate',
  '疑似检测': 'Suspected Processed',
  '疑似变化': 'Suspected Trend',
  '疑似检测/确诊': 'Suspected Processed',
  '重症率': 'Critical Rate',
  '全国': 'Country',
  '非湖北': 'Excl. Hubei',
  '湖北省': 'Hubei',
  '现存确诊': 'Exists Confirmed',
  '累计重症比例': 'Accum. Critical Rate',
  '累计重症': 'Accum. Critical',
  '新增重症': 'Critical Incr.',
  '新增治愈': 'Cured Incr.',
  '新增死亡': 'Dead Incr.',
  '确诊': 'Confirmed',
  '亚洲': 'Asia',
  '欧洲': 'Europe',
  '北美洲': 'North America',
  '南美洲': 'South America',
  '非洲': 'Africa',
  '大洋洲': 'Oceania',
  '全部国家': 'All Countries',
  '国家或城市': 'Country or city',
  '搜索': 'Search',
  '国家对比': 'Compare Countries',
  '累计确诊 >= 500 国家': 'Confirmed >= 500 Counties',
  '累计确诊人数': 'Total Confirmed Count',
  '现存确诊人数': 'Exists Confirmed Count',
  '新增确诊人数': 'Increased Count',
  '累计死亡人数': 'Total Dead Count',
  '死亡人数': 'Dead Count',
  '中国趋势': 'China Trends',
  '每百万人口确诊人数': 'Confirmed per 1M People',
  '累计确诊：': 'Total Confirmed: ',
  '现存确诊：': 'Exists Confirmed: ',
};

function getTextForKey(k) {
  if (currentLanguage !== 'en') {
    return k;
  }

  return languageMap[k] || k;
}

function chartTooltipCircle(color){
  return `<span style='display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;'></span>`;
};

function generateTooltip(name, r) {
  const baseSeries = [
    [ '治愈', 'cured', 'rgb(64,141,39)' ],
    [ '死亡', 'dead', 'gray' ],
    [ '现存', 'insick', 'rgb(224,144,115)' ],
  ];
  const total = r.confirmedCount;
  return `<b>${name}</b><table><tr><td>${chartTooltipCircle('darkred')}</td><td>${getTextForKey('确诊')}: </td><td>${total}</td></tr>${baseSeries.map(([ name, key, color ]) => {
    return `<tr><td>${chartTooltipCircle(color)}</td><td>${getTextForKey(name)}: </td><td class='text-right'>${r[key + 'Count']} </td><td class='text-right'>(${(Math.floor(r[key + 'Count']/total*10000)/100).toFixed(2)}%)</td></tr>`;
  }).join('')}</table>`;
}

function getVisualPieces(type) {
  const pieces = {
    world: [
      { min: 50000, label: '50000人及以上', color: 'rgb(143,31,25)' },
      { min: 10000, max: 49999, label: '10000-49999人', color: 'rgb(185,43,35)' },
      { min: 5000, max: 9999, label: '5000-9999人', color: 'rgb(213,86,78)' },
      { min: 1000, max: 4999, label: '1000-4999人', color: 'rgb(239,140,108)' },
      { min: 100, max: 999, label: '100-999人', color: 'rgb(248,211,166)' },
      { min: 1, max: 99, label: '1-99人', color: 'rgb(252,239,218)' },
    ],
    country: [
      { min: 10000, label: '10000人及以上', color: 'rgb(143,31,25)' },
      { min: 1000, max: 9999, label: '1000-9999人', color: 'rgb(185,43,35)' },
      { min: 500, max: 999, label: '500-999人', color: 'rgb(213,86,78)' },
      { min: 100, max: 499, label: '100-499人', color: 'rgb(239,140,108)' },
      { min: 10, max: 99, label: '10-99人', color: 'rgb(248,211,166)' },
      { min: 1, max: 9, label: '1-9人', color: 'rgb(252,239,218)' },
    ],
    city: [
      { min: 1000, label: '1000人及以上', color: 'rgb(143,31,25)' },
      { min: 500, max: 999, label: '500-999人', color: 'rgb(185,43,35)' },
      { min: 100, max: 499, label: '100-499人', color: 'rgb(213,86,78)' },
      { min: 50, max: 100, label: '50-99人', color: 'rgb(239,140,108)' },
      { min: 10, max: 49, label: '10-49人', color: 'rgb(248,211,166)' },
      { min: 1, max: 9, label: '1-9人', color: 'rgb(252,239,218)' },
    ]
  };
  const visualPieces = pieces[type] || pieces.city;
  return visualPieces;
}

async function prepareChartMap(mapName) {
  let geoJSON = null;
  if (!echarts.getMap(mapName)) {
    const isProvince = [ 'china', 'china-cities', 'world' ].indexOf(mapName) === -1;
    const url = `map/json/${isProvince ? 'province/' : ''}${mapName}.json`;
    geoJSON = (await axios.get(url, {
      onDownloadProgress: (pe) => {
        // showLoading('map', pe);
      }
    })).data;
    echarts.registerMap(mapName, geoJSON);
  } else {
    geoJSON = echarts.getMap(mapName).geoJson;
  }
  return geoJSON;
}

const showLoading = (() => {
  const el = $('#' + chartsContainerId);
  let loading = null;
  return function (show = true, pe) {
    if (typeof show === 'string') {
      const progress = pe && pe.lengthComputable ? `${Math.ceil(pe.loaded/pe.total*100)}% ` : '';
      const msg = `Loading ${show} ${progress}...`;
      if (loading) {
        $('.loading-overlay-content', el.overlay).text(msg);
      } else {
        loading = el.loading({ message: msg });
      }
    } else {
      if (show) {
        loading = el.loading({ message: 'Loading ...'});
      } else {
        el.loading('stop');
        loading = null;
      }
    }
  };

})();

async function getData(type) {
  if (!allDataStore[type]) {
    const t = typeof build_timestamp !== 'undefined' ? parseInt(build_timestamp) || 1 : 1;
    const ret = await axios.get(`by_${type}.json?t=${t}`, {
      onDownloadProgress: (pe) => {
        if (pe.lengthComputable) {
          // showLoading('data', pe);
        }
      }
    });
    allDataStore[type] = ret.data;
  }

  return JSON.parse(JSON.stringify(allDataStore[type]));
}

function switchMapMetrics(m) {
  mapDisplayMetrics = m;
  showAllCitiesMap();
}

function shortAreaName(name) {
  return name.replace(/(区|省|市|自治区|壮|回|族|维吾尔)/g, '');
}

async function createMapChartConfig({ mapName, data, valueKey = 'confirmedCount' }) {
  valueKey = mapDisplayMetrics === 'accum' ? 'confirmedCount' : 'insickCount';
  let geoJSON = await prepareChartMap(mapName);
  geoJSON.features.forEach(v => {
    const showName = v.properties.name;
    data.forEach(d => {
      d.records.forEach(r => {
        const name = r.name;
        if (name.substr(0, showName.length) === showName || showName.substr(0, name.length) === name) {
          r.showName = showName;
        }
      });
    });
  });

  const visualPieces = getVisualPieces(mapName === 'china' ? 'country' : 'city');
  const hideBarChart = (mapName === 'china-cities');

  const barSeriesConfig = {
    stack: '人数',
    type: 'bar',
    label: {
      position: 'inside',
      show: true,
      color: '#eee',
      formatter: ({ data }) => {
        return data[0] > 0 ? data[0] : '';
      }
    },
    tooltip: {
      formatter: ({ data }) => {
        return generateTooltip(data[1], data[2]);
      },
    },
    barMaxWidth: 30,
  };

  const config = {
    baseOption: {
      title: {
        text: '全国新冠肺炎发展趋势',
        // target: 'self',
        // bottom: '10',
        // left: '10',
        subtext: mapDisplayMetrics === 'accum' ? getTextForKey('当前显示累计确诊') : getTextForKey('当前显示现存确诊'),
        sublink: `javascript:switchMapMetrics("${mapDisplayMetrics === 'accum' ? 'current' : 'accum'}")`,
        subtarget: 'self',
        subtextStyle: {
          color: '#888'
        }
      },
      timeline: {
        axisType: 'category',
        // realtime: false,
        // loop: false,
        autoPlay: false,
        currentIndex: data.length - 1,
        playInterval: 1000,
        // controlStyle: {
        //     position: 'left'
        // },
        data: data.map(d => d.day),
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      // toolbox: {
      //   show: true,
      //   orient: 'vertical',
      //   left: 'right',
      //   top: 'center',
      //   feature: {
      //     dataView: {readOnly: false},
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },
      grid: hideBarChart ? [] : [
        {
          top: 10,
          width: '100%',
          left: 10,
          containLabel: true
        }
      ],
      xAxis: hideBarChart ? [] : [
        {
          type: 'value',
          axisLine: { show: false, },
          axisTick: { show: false, },
          axisLabel: { show: false, },
          splitLine: { show: false,},
        }
      ],
      yAxis: hideBarChart ? [] : [
        {
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
          },
          axisTick: { show: false, },
          axisLine: { show: false, },
        }
      ],
      visualMap: [
        {
          type: 'piecewise',
          pieces: visualPieces,
          left: 'auto',
          right: 30,
          bottom: 100,
          seriesIndex: 0,
        },
        // {
        //   type: 'piecewise',
        //   pieces: visualPieces,
        //   dimension: 0,
        //   show: false,
        //   seriesIndex: 1,
        // },
      ],
      series: [
        {
          name: '',
          type: 'map',
          mapType: mapName,
          label: {
            show: !hideBarChart,
          },
          left: hideBarChart ? 'center' : '30%',
          tooltip: {
            formatter: ({ name, data }) => {
              if (data) {
                // const { name, /*value,*/ confirmed, dead, cured, increased, insick } = data;
                // const tip = `<b>${name}</b><br />${getTextForKey('现存确诊：')}${insick}<br />${getTextForKey('累计确诊：')}${confirmed}<br />${getTextForKey('治愈人数：')}${cured}<br />${getTextForKey('死亡人数：')}${dead}<br />${getTextForKey('新增确诊：')}${increased}`;
                // return tip;
                const { name, record } = data;
                return generateTooltip(name, record);
              }
              return `<b>${name}</b><br />${getTextForKey('暂无数据')}`;
            },
          },
          z: 1000,
        }
      ].concat((hideBarChart ? [] : [
        {
          name: getTextForKey('治愈'),
          color: 'rgb(64,141,39)',
        },
        {
          name: getTextForKey('死亡'),
          color: 'gray',
        },
        {
          name: getTextForKey('治疗'),
          color: 'rgb(224,144,115)',
        }
      ].map(c => {
        return Object.assign({}, barSeriesConfig, c);
      })))
    },
    options: data.map(d => {
      d.records.sort((a ,b) => a.confirmedCount < b.confirmedCount ? -1 : 1);
      return {
        series: [
          {
            title: {
              text: d.day,
            },
            data: d.records.map(r => {
              return {
                name: r.showName,
                province: r.name,
                value: r[valueKey],
                record: r,
                confirmed: r.confirmedCount,
                dead: r.deadCount,
                cured: r.curedCount,
                increased: r.confirmedIncreased,
                insick: r.insickCount,
              };
            }),
          },
        ].concat(hideBarChart ? [] : [ 'cured', 'dead', 'insick' ].map(k => {
          return {
            data: d.records.map(r => {
              return [ r[k + 'Count'], r.showName || r.name ];
            })
          };
        }))
      };
    })
  };

  return config;
};

async function setupMapCharts(records, container, province = '', allCities = false) {
  const mapName = !province ? (allCities ? 'china-cities' : 'china') : {
    '安徽': 'anhui', '澳门': 'aomen', '北京': 'beijing', '重庆': 'chongqing', '福建': 'fujian', '甘肃': 'gansu', '广东': 'guangdong', '广西': 'guangxi', '贵州': 'guizhou', '海南': 'hainan', '河北': 'hebei', '黑龙江': 'heilongjiang', '河南': 'henan', '湖北': 'hubei', '湖南': 'hunan', '江苏': 'jiangsu', '江西': 'jiangxi', '吉林': 'jilin', '辽宁': 'liaoning', '内蒙古': 'neimenggu', '宁夏': 'ningxia', '青海': 'qinghai', '山东': 'shandong', '上海': 'shanghai', '山西': 'shanxi', '陕西': 'shanxi1', '四川': 'sichuan', '台湾': 'taiwan', '天津': 'tianjin', '香港': 'xianggang', '新疆': 'xinjiang', '西藏': 'xizang', '云南': 'yunnan', '浙江': 'zhejiang',
  }[shortAreaName(province)];
  const html = '<div id="mapchart" class="mychart" style="display:inline-block;width:100%;height:100%;"></div>';
  container.innerHTML = html;
  const cfg = await createMapChartConfig({ mapName, data: records });
  const chart = echarts.init(document.getElementById('mapchart'));
  chart.setOption(cfg);

  return [ chart ];
};

async function prepareChartData(type = 'area',name='') {
  // showLoading();

  const dataList = await getData(type);
  allCharts.forEach(c => {
    c.clear();
    c.dispose();
  });
  allCharts = [];

  document.getElementById(chartsContainerId).innerHTML = 'Loading...';

  let records = dataList;
  if (name) {
    if (type === 'area') {
      records = dataList.filter(v => v.name === name)[0].cityList;
    } else {
      records = dataList.map(d => {
        return {
          day: d.day,
          records: d.records.filter(p => p.name === name)[0].cityList,
        };
      });
    }
  }
  records.forEach(v => {
    v.showName = v.name;
  });

  return records;
};

async function showAllCitiesMap() {
  const zhixiashi = [ '北京市', '重庆市', '上海市', '天津市' ];
  const data = await prepareChartData('date');
  const records = data.map(d => {
    return {
      day: d.day,
      records: d.records.reduce((p, v) => {
        return p.concat(zhixiashi.indexOf(v.name) > -1 ? v : v.cityList);
      }, []),
    };
  });
  allCharts = await setupMapCharts(records, document.getElementById(chartsContainerId), '', true);
};

showAllCitiesMap();
