import React from 'react';
import axios from 'axios';
import './App.css'

import InputsSection from './components/inputsSection/InputsSection'
import RollSection from './components/rollSection/RollSection'
import SymbolsList from './components/symbolsList/SymbolsList';

interface IValues {
  bet: number;
  drums: number;
  rows: number;
}

interface ISymbol {
  name: string;
  probs: number[];
  coef: number;
}

function App() {
  const [values, setValues] = React.useState<IValues>({
    bet: 1000,
    drums: 1,
    rows: 1,
  })
  const [symbols, setSymbols] = React.useState<ISymbol[]>([])
  const [payback, setPayback] = React.useState<number>()
  const [win, setWin] = React.useState<number>()
  const [rolls, setRolls] = React.useState<string[][]>()

  const onRoll = React.useCallback(async () => {
    const possibilities: {[key: string]: number[]} = {};
    symbols.forEach(symbol => {
      possibilities[symbol.name] = symbol.probs;
    })

    const wincoef: {[key: string]: number} = {};
    symbols.forEach(symbol => {
      wincoef[symbol.name] = symbol.coef;
    })

    const { data } = await axios.post('http://127.0.0.1:8000/roll', {
      possibilities,
      wincoef,
      ...values,
    })

    setWin(data.win)
    setPayback(undefined)
    setRolls(data.result)
  }, [ symbols, values ])

  const onCalc = React.useCallback(async () => {
    const possibilities: {[key: string]: number[]} = {};
    symbols.forEach(symbol => {
      possibilities[symbol.name] = symbol.probs;
    })

    const wincoef: {[key: string]: number} = {};
    symbols.forEach(symbol => {
      wincoef[symbol.name] = symbol.coef;
    })

    const { data } = await axios.post('http://127.0.0.1:8000/calculatePayback', {
      possibilities,
      wincoef,
      ...values,
    })

    console.log(data);
    
    
    setPayback(data.predictedPayback)
    setWin(undefined)
  }, [ symbols, values ])

  React.useEffect(() => {
    setRolls(undefined)
    setWin(undefined)
    setPayback(undefined)
  }, [values, symbols])


  return (
    <>
      <RollSection
        drums={values.drums}
        rows={values.rows}
        rolls={rolls}
        payback={payback}
        win={win}
        onRoll={onRoll}
        onCalc={onCalc}
      />
      <InputsSection setValues={setValues} />
      <div className="divider"/>
      <SymbolsList
        drums={values.drums}
        symbols={symbols}
        setSymbols={setSymbols}
      />
    </>
  )
}

export default App
