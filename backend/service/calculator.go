package service

import (
	"calculator-backend/model"
	"errors"
	"math"
)

var (
	ErrDivisionByZero     = errors.New("division by zero")
	ErrUnknownOperation   = errors.New("unknown operation")
	ErrNegativeSquareRoot = errors.New("can not calculate square root of a negative number")
)

type CalculatorService interface {
	Calculate(op model.Operation) (float64, error)
}

type calculatorServiceImpl struct{}

func NewCalculatorService() CalculatorService {
	return &calculatorServiceImpl{}
}

func (s *calculatorServiceImpl) Calculate(op model.Operation) (float64, error) {
	switch op.Operator {
	case model.OpAdd:
		return op.A + op.B, nil
	case model.OpSubtract:
		return op.A - op.B, nil
	case model.OpMultiply:
		return op.A * op.B, nil
	case model.OpDivide:
		if op.B == 0 {
			return 0, ErrDivisionByZero
		}
		return op.A / op.B, nil
	case model.OpPower:
		return math.Pow(op.A, op.B), nil
	case model.OpSqrt:
		if op.A < 0 {
			return 0, ErrNegativeSquareRoot
		}
		return math.Sqrt(op.A), nil
	case model.OpPercent:
		return (op.A * op.B) / 100, nil
	default:
		return 0, ErrUnknownOperation
	}
}
