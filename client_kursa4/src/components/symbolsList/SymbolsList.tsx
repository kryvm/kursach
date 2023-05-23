import React, { useEffect } from 'react'
import SymbolRow from './symbolRow/SymbolRow';

import './SymbolsList.css'

interface Props {
  drums: number;
  symbols: ISymbol[];
  setSymbols: (symbols: ISymbol[]) => void;
}

interface ISymbol {
  name: string;
  probs: number[];
  coef: number;
}

function SymbolsList({ drums, symbols, setSymbols }: Props) {

  const addSymbol = () => {
    const newSymbols = [...symbols];
    newSymbols.push({
      name: `Symbol${(newSymbols.length + 1)}`,
      probs: Array.from({ length: drums }).map(() => 1),
      coef: 1,
    });
    setSymbols(newSymbols);
  }

  const changeSymbolName = (index: number) => (name: string) => {
      const newSymbols = [...symbols];
      newSymbols[index].name = name;
      setSymbols(newSymbols);
  }

  const changeSymbolProb = (index: number) => (prob: number, probIndex: number) => {
    const newSymbols = [...symbols];
    newSymbols[index].probs[probIndex] = prob;
    setSymbols(newSymbols);
  }

  const changeSymbolCoef = (index: number) => (coef: number) => {
    const newSymbols = [...symbols];
    newSymbols[index].coef = coef;
    setSymbols(newSymbols);
  }

  useEffect(() => {
    const newSymbols = [...symbols];
    newSymbols.forEach(symbol => {
      symbol.probs = Array.from({ length: drums }).map(() => 1);
    }
    );
    setSymbols(newSymbols);
  }, [drums]);

  useEffect(() => {
    setSymbols(symbols);
  }, [symbols]);


  return (
    <div className="symbols-list">
      <div className="head">
        <span>
          SYMBOL
        </span>
        <span>
          PROBABILITY
        </span>
        <span>
          COEF
        </span>
      </div>
      <button
        onClick={addSymbol}
      >
        Add symbol
      </button>
      {
        symbols.map((symbol, i) => (
          <SymbolRow
            key={i}
            symbol={symbol}
            setName={changeSymbolName(i)}
            setProb={changeSymbolProb(i)}
            setCoef={changeSymbolCoef(i)}
          />
        ))
      }
    </div>
  )
}

export default SymbolsList