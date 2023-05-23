import React from 'react'
import './InputsSection.css'

interface IValues {
  bet: number;
  drums: number;
  rows: number;
}

interface Props {
  setValues: (values: IValues) => void
}

const prohibitKeyboardInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  e.preventDefault()
}

function InputsSection({ setValues }: Props) {
  const [bet, setBet] = React.useState(1000)
  const [drums, setDrums] = React.useState(1)
  const [rows, setRows] = React.useState(1)

  React.useEffect(() => {
    if (bet && drums && rows) {
      setValues({bet, drums, rows})
    }
  }, [bet, drums, rows, setValues])


  return (
    <div className="inputs">
      <label>
        Bet:
        <input 
          type="number"
          value={bet}
          onChange={e => setBet(Number(e.target.value))}
        />
      </label>
      <label>
        Drums:
        <input 
          type="number"
          min={1}
          max={7}
          maxLength={1}
          value={drums}
          onChange={e => setDrums(Number(e.target.value))}
          onKeyDown={prohibitKeyboardInput}
        />
      </label>
      <label>
        Rows:
        <input 
          type="number"
          min={1}
          max={5}
          maxLength={1}
          value={rows}
          onChange={e => setRows(Number(e.target.value))}
          onKeyDown={prohibitKeyboardInput}
        />
      </label>
    </div>
  )
}

export default InputsSection