import { StyleSheet, View, Text } from 'react-native';
import {  omit, range, shuffle, sortBy, update} from 'rambdax'
import { useEffect, useState } from 'react';

const data = getData()

function nextBee(currentInstance: any){
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

const BACKGROUND = '#97e7e7'

const CONTAINER = {
  flex           : 1,
  // flexWrap       : 'wrap',
  // alignItems     : 'stretch',
  // justifyContent : 'space-evenly',
}

const nextStyle = {
  // fontWeight : 'bold',
  fontSize   : 33,
  padding    : 15,
  margin     : 30,
  color      : BACKGROUND,
}

const itemCell = {
  padding         : 4,
  margin          : 8,
  // border radius  : 4,
  borderRadius    : 4,
  // justifyContent  : 'center',
  // alignItems      : 'center',
  // minHeight       : '18%',
  backgroundColor : '#5d5a58',
  // width           : 'auto',
}

const translationCell = omit('backgroundColor')(itemCell)

function getCellStyle(word:any){
  return word.hide ?
    styles.itemSolvedCell :
    styles.itemCell
}

function getItemStyle(word: any){
  const itemStyle = {
    // fontWeight : 'bold',
    fontSize   : 18.8,
    color      : '#e4e1e1',
  }
  const whenWrongStyle = {
    ...itemStyle,
    color : '#ffa0aa',
  }
  const whenSolvedStyle = {
    ...itemStyle,
    color : BACKGROUND,
  }

  if (word.hide) return whenSolvedStyle
  if (word.wrong) return whenWrongStyle

  return itemStyle
}

export function App() {
  let [globalIndex, setGlobalIndex] = useState(0)
  let [ showNext, setShowNext ] = useState(false)
  let [index, setIndex] = useState(0)
  let [visibleAnswer, setVisibleAnswer] = useState('')
  const [ currentDataInstance, setCurrentDataInstance ] = useState<any>(null)
  let handleNext = () => {
      setGlobalIndex(globalIndex + 1)
      setShowNext(false)
      setIndex(0)
      setVisibleAnswer('')
      setCurrentDataInstance(nextBee(data[ globalIndex + 1 ]))
  }
  const nextButton = () =>
    <View style={ styles.itemContainer }>
      <View style={ styles.itemCell }>
        <Text onPress={ handleNext } style={ nextStyle }>
            Next
        </Text>
      </View>
    </View>

  let handlePress = (i: any) => () => {
    let found = currentDataInstance.words.find((x: any) => x.showIndex === i)
    if(found.originalIndex !== index) return
    const newWords = update(
      found.showIndex,
      {
        ...found,
        hide : true,
      },
      currentDataInstance.words
    )
    let newIndex=  index + 1
    if(newIndex === currentDataInstance.words.length){
      setShowNext(true)
    }
    setIndex(newIndex)
    setCurrentDataInstance({
      ...currentDataInstance,
      words : newWords,
    })
    let visibleAnswerx = currentDataInstance.answer.filter((_, i) => i < newIndex).join(' ')
    setVisibleAnswer(visibleAnswerx)
  }

  const listOfQuestions = () =>
  <View style={ styles.itemContainer }>
    {currentDataInstance.words.map(
      (word: any, i: any) => 
          <View 
            key={`${currentDataInstance.words[0].word}-${i}`} 
            style={getCellStyle(word)}
          >
            <Text
              onPress={handlePress(i)} 
              style={getItemStyle(word)}
            >
              {word.word}
            </Text>
          </View>
        
    )}
  </View>
  useEffect(() => {
    setCurrentDataInstance(nextBee(data[ globalIndex ]))
  }, [])
  if(currentDataInstance === null) return null

  return (
    <View style={ styles.rootContainer }>
        <View style={ styles.translationMargin } />
        <View style={ styles.translation }>
          <View style={ styles.genericContainer }>
            <Text
              onPress={ this.handleNext }
              style={ translationCell }
            >
              {currentDataInstance.translation}
            </Text>
          </View>
        </View>

        <View style={ styles.answer }>
          <View style={ styles.genericContainer }>
            <Text style={ translationCell }>
              {visibleAnswer}
            </Text>
          </View>
        </View>
        <View style={ styles.item }>
          {
            showNext ?
              nextButton() :
              listOfQuestions()
          }
        </View>
      </View>
  );
}


const styles = StyleSheet.create({
  rootContainer : {
    flex            : 0,
    backgroundColor : BACKGROUND,
    width           : '100%',
    height          : '100%',
  },
  translationMargin : {
    flex            : 0,
    backgroundColor : BACKGROUND,
    width           : '100%',
    height          : '5%',
  },
  translation : {
    flex            : 0,
    backgroundColor : BACKGROUND,
    width           : '100%',
    height          : '10%',
  },
  genericContainer : CONTAINER,
  answer           : {
    flex            : 0,
    backgroundColor : '#9eb4ad',
    width           : '100%',
    height          : '10%',
  },
  item : {
    flex   : 0,
    width  : '100%',
    height : '75%',
  },
  itemContainer : {
    flex           : 1,
    flexDirection  : 'row',
    flexWrap       : 'wrap',
    alignItems     : 'stretch',
    justifyContent : 'space-evenly',
  },
  itemCell,
  itemSolvedCell : {
    ...itemCell,
    backgroundColor : BACKGROUND,
  },
})


function getData (){
  return [
    {
      "from": "Вярваш ли в любовта на пръв поглед или трябва да вляза отново.",
      "to": "Do you believe in love at first sight or should I come in again."
    },
    {
      "from": "Любовта и приятелството са взаимно изключващи се.",
      "to": "Love and friendship are mutually exclusive."
    },
    {
      "from": "Капка любов струва повече от океан воля и разбиране.",
      "to": "A drop of love is more than an ocean of will and understanding."
    },
    {
      "from": "Ако искате да бъдете щастливи за час, опийте се.",
      "to": "If you want to be happy for an hour, get drunk."
    },
    {
      "from": "Всеки, който се ядосва на критиката, си признава че я заслужава.",
      "to": "Anyone who is angry with criticism, admits that he deserves it."
    },
    {
      "from": "Човек трябва да се подчини на изкушенията, защото не се знае, дали те ще се върнат отново.",
      "to": "Man should submit to temptations, because no one knows if they are coming back."
    },
    {
      "from": "Живеете, защото Бог го е искал, затова му покажете, че това е добра идея.",
      "to": "You live because God wanted it, so show him it was a good idea."
    },
    {
      "from": "Имам толкова хитър план, че можеш да му сложиш опашка и да го наречеш невестулка.",
      "to": "I got a plan so cunning you could put a tail on it and call it a weasel."
    },
    {
      "from": "Въпреки че хората изискват искрени критики, те искат само да чуят комплименти.",
      "to": "Although people demand sincere criticism, they only want to hear compliments."
    },
  ]
}
  
