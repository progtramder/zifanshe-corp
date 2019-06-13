function alert(tilte) {
  wx.showModal({
    content: tilte,
    showCancel: false,
    confirmColor: '#F56C6C',
    confirmText: '知道了'
  })
}

function formatEvaluation(evals, coefficient) {
  const results = []
  let total = 0
  if (evals.length > 0) {
    //先按照评估人的权重进行排序
    const sortBy = function (a, b) {
      return a.weight - b.weight
    }
    evals.sort(sortBy)
    //根据权重计算平均值，相同权重先计算平均值然后再乘上权重相加
    const calcMean = function(evals, indexDimension) {
      let pivot = 0
      let sum = 0, mean = 0
      let weight = evals[0].weight
      for (let i = 0; i < evals.length; i++) {
        const e = evals[i]
        if (e.weight == weight) {
          //权重相同的项计算总和
          sum += e.result[indexDimension].score
        } else {
          //直到新的权重出现，则计算之前权重项均值乘上权重然后改变
          //设置新权重的相关参数
          mean += (sum / (i - pivot)) * weight
          weight = e.weight
          pivot = i
          sum = e.result[indexDimension].score
        }
      }
      //相同的权重一直延续到最后一项，所以此时计算之前权重项均值乘上权重
      mean += (sum / (evals.length - pivot)) * weight
      return mean
    }

    const dimensions = evals[0].result.length
    for (let i = 0; i < dimensions; i++) {
      results.push({
        dimension: evals[0].result[i].dimension,
        score: Number((calcMean(evals, i) * coefficient).toFixed(0))
      })
    }

    results.forEach(e => {
      total += e.score
    })
  }
  
  return {total: total, mean: results, raw: evals}
}

module.exports = {
  alert,
  formatEvaluation,
};