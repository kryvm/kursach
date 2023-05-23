import React from 'react'
import './SymbolRow.css'

interface ISymbol {
  name: string;
  probs: number[];
  coef: number;
}

interface Props {
  symbol: ISymbol;
  setName: (name: string) => void;
  setProb: (prob: number, probIndex: number) => void;
  setCoef: (coef: number) => void;
}

const prohibitKeyboardInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  e.preventDefault()
}

function SymbolRow({ 
  symbol, 
  setName,
  setProb,
  setCoef,
}: Props) {

  return (
    <div className="symbol-row">
      <input 
        type="text" 
        value={symbol.name} 
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        className="name"
      />

      <div className="probs">
        {symbol.probs.map((prob, i) => (
          <input
            key={i}
            type="number"
            value={prob}
            onChange={e => setProb(Number(e.target.value), i)}
            min={0}
            step={0.05}
            onKeyDown={prohibitKeyboardInput}
          />
        ))}
      </div>

      <input
        type="number"
        value={symbol.coef}
        onChange={e => setCoef(Number(e.target.value))}
        className="coef"
        min={0}
        step={0.05}
        onKeyDown={prohibitKeyboardInput}
      />
    </div>
  )
}

export default SymbolRow