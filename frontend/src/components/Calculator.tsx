import React, { useState } from 'react';
import { calculate, type OperatorType } from '../api/calculator';
import './Calculator.css';

const OP_SYMBOLS: Record<OperatorType, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  square_root: '√',
  percent: '%'
};

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [history, setHistory] = useState<string>('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<OperatorType | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNumClick = (num: string) => {
    setErrorMsg('');
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    setErrorMsg('');
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setHistory('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
    setErrorMsg('');
  };

  const handleOperation = async (op: OperatorType) => {
    setErrorMsg('');
    const currentValue = parseFloat(display);

    if (op === 'square_root') {
      const response = await calculate({ a: currentValue, b: 0, operation: 'square_root' });
      if (response.error) {
        setErrorMsg(response.error);
      } else {
        setDisplay(String(response.result));
        setHistory(`√${currentValue} =`);
        setPreviousValue(null);
        setOperator(null);
      }
      setWaitingForNewValue(true);
      return;
    }

    if (previousValue === null) {
      setPreviousValue(currentValue);
      setHistory(`${currentValue} ${OP_SYMBOLS[op]}`);
    } else if (operator && !waitingForNewValue) {
      const response = await calculate({ a: previousValue, b: currentValue, operation: operator });
      if (response.error) {
        setErrorMsg(response.error);
        setPreviousValue(null);
      } else {
        setDisplay(String(response.result));
        setPreviousValue(response.result!);
        setHistory(`${response.result} ${OP_SYMBOLS[op]}`);
      }
    } else {
      setHistory(`${previousValue} ${OP_SYMBOLS[op]}`);
    }

    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEquals = async () => {
    if (operator === null || previousValue === null) return;

    const currentValue = parseFloat(display);
    const response = await calculate({ a: previousValue, b: currentValue, operation: operator });

    if (response.error) {
      setErrorMsg(response.error);
    } else {
      setDisplay(String(response.result));
      setHistory(`${previousValue} ${OP_SYMBOLS[operator]} ${currentValue} =`);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
      setErrorMsg('');
    }
  };

  const getDisplayClass = () => {
    if (display.length > 14) return 'display-value small';
    if (display.length > 9) return 'display-value medium';
    return 'display-value';
  };

  return (
    <div className="calculator-container">
      <div className="display">
        <div className="display-error">{errorMsg}</div>
        <div className="display-history">{history}</div>
        <div className={getDisplayClass()}>{display}</div>
      </div>
      <div className="keypad">
        <button className="btn-clear" onClick={handleClear}>AC</button>
        <button className="btn-operator" onClick={() => handleOperation('square_root')}>√</button>
        <button className="btn-operator" onClick={() => handleOperation('power')}>x²</button>
        <button className="btn-operator" onClick={() => handleOperation('divide')}>÷</button>

        <button onClick={() => handleNumClick('7')}>7</button>
        <button onClick={() => handleNumClick('8')}>8</button>
        <button onClick={() => handleNumClick('9')}>9</button>
        <button className="btn-operator" onClick={() => handleOperation('multiply')}>×</button>

        <button onClick={() => handleNumClick('4')}>4</button>
        <button onClick={() => handleNumClick('5')}>5</button>
        <button onClick={() => handleNumClick('6')}>6</button>
        <button className="btn-operator" onClick={() => handleOperation('subtract')}>−</button>

        <button onClick={() => handleNumClick('1')}>1</button>
        <button onClick={() => handleNumClick('2')}>2</button>
        <button onClick={() => handleNumClick('3')}>3</button>
        <button className="btn-operator" onClick={() => handleOperation('add')}>+</button>

        <button onClick={() => handleNumClick('0')}>0</button>
        <button onClick={handleDecimal}>.</button>
        <button className="btn-operator" onClick={() => handleOperation('percent')}>%</button>
        <button className="btn-equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};