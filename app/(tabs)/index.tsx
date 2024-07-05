import { StyleSheet, View, Text } from 'react-native';
import {  omit, range, shuffle, sortBy} from 'rambdax'
import * as data from './db.json'
import { useEffect, useState } from 'react';

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

const BACKGROUND = '#67e7e7'

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
    fontWeight : 'bold',
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

export default function HomeScreen() {
  let [ showNext, setShowNext ] = useState(false)
  let [answer, setAnswer] = useState('')
  let [index, setIndex] = useState(0)
  let [visibleAnswer, setVisibleAnswer] = useState('')
  const [ current, setCurrent ] = useState<any>(null)
  const [ currentDataInstance, setCurrentDataInstance ] = useState<any>(null)
  let handleNext = () => {
    console.log('next')
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
    console.log(i)
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
              // style={getItemStyle(word)}
            >
              {word.word}
            </Text>
          </View>
        
    )}
  </View>
  useEffect(() => {
    setCurrent(data[ 0 ])
    setCurrentDataInstance(nextBee(data[ 0 ]))
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

