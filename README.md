export function nextBee(currentInstance: any){
  const wordsList = currentInstance.from.split(' ')
  const randomizedIndexes = shuffle(
    range(0, wordsList.length)
  )
  const wordsRaw = wordsList.map((x, i) => ({
    originalIndex : i,
    showIndex     : randomizedIndexes[ i ],
    word          : x,
    wrong         : false,
    hide          : false,
  }))

  const words = sortBy(
    (x: any) => x.showIndex,
    wordsRaw
  )

  return {
    answer      : wordsList,
    translation : currentInstance.to,
    words,
  }
}

function getData (){
  const data = pluck('doc', datax.rows)
  const result = piped(
    data,
    filter((x: any) => allTrue(
      () => x[ fromKey ],
      () => x[ fromKey ].length > 0,
      () => x[ fromKey ].length < 94,
      () => x[ toKey ],
      () => x[ toKey ].length > 0,
    )),
    map(produce({
      from : (x: any)=> x[ fromKey ],
      to   : (x: any) => x[ toKey ],
    }))
  )

  return result
}