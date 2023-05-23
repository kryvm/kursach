import React from 'react';
import './RollSection.css';

interface Props {
  drums: number;
  rows: number;
  onRoll: () => void;
  onCalc: () => void;
  payback?: number;
  win?: number;
  rolls?: string[][];
}

const getUndefinedRolls = (drums: number, rows: number): string[][] => {
  const rolls = [];
  for (let i = 0; i < rows; i++) {
    rolls.push(Array.from({ length: drums }).map(() => '?'));
  }
  return rolls;
};

function RollSection({ drums, rows, rolls, payback, win, onRoll, onCalc }: Props) {
  const values = React.useMemo(() => {
    if (rolls) {
      return rolls;
    }
    return getUndefinedRolls(drums, rows);
  }, [drums, rows, rolls]);

  return (
    <div className="rollzone-wrap">
      <div
        className="rollzone"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {values.map((row, rowIndex) => (
          <div className="rollzone-row" key={rowIndex} style={{
            gridTemplateColumns: `repeat(${drums}, 1fr)`,
          }}>
            {row.map((value, valueIndex) => (
              <div className="rollzone-value" key={valueIndex}>
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rollzone-buttons">
        <button className="btn btn-primary" onClick={onRoll}>
          Roll
        </button>
        <button className="btn btn-primary" onClick={onCalc}>
          Calc
        </button>
        <span>{win && `Win: ${win}`}</span>
        <span>{payback && `Payback: ${payback}%`}</span>
      </div>
    </div>
  );
}

export default RollSection;
