package service

import (
	"testing"

	"calculator-backend/model"
)

func TestCalculate(t *testing.T) {
	svc := NewCalculatorService()

	tests := []struct {
		name          string
		operation     model.Operation
		expectedRes   float64
		expectedError error
	}{
		{
			name: "Addition",
			operation: model.Operation{
				A: 5, B: 3, Operator: model.OpAdd,
			},
			expectedRes:   8,
			expectedError: nil,
		},
		{
			name: "Subtraction",
			operation: model.Operation{
				A: 10, B: 4, Operator: model.OpSubtract,
			},
			expectedRes:   6,
			expectedError: nil,
		},
		{
			name: "Multiplication",
			operation: model.Operation{
				A: 3, B: 4, Operator: model.OpMultiply,
			},
			expectedRes:   12,
			expectedError: nil,
		},
		{
			name: "Division",
			operation: model.Operation{
				A: 20, B: 5, Operator: model.OpDivide,
			},
			expectedRes:   4,
			expectedError: nil,
		},
		{
			name: "Power",
			operation: model.Operation{
				A: 2, B: 3, Operator: model.OpPower,
			},
			expectedRes:   8,
			expectedError: nil,
		},
		{
			name: "Square Root",
			operation: model.Operation{
				A: 16, B: 0, Operator: model.OpSqrt, // 'B' ignored by square root
			},
			expectedRes:   4,
			expectedError: nil,
		},
		{
			name: "Percentage",
			operation: model.Operation{
				A: 20, B: 50, Operator: model.OpPercent,
			},
			expectedRes:   10,
			expectedError: nil,
		},

		//error cases
		{
			name: "Division by zero",
			operation: model.Operation{
				A: 10, B: 0, Operator: model.OpDivide,
			},
			expectedRes:   0,
			expectedError: ErrDivisionByZero,
		},
		{
			name: "Negative Square Root",
			operation: model.Operation{
				A: -4, B: 0, Operator: model.OpSqrt,
			},
			expectedRes:   0,
			expectedError: ErrNegativeSquareRoot,
		},
		{
			name: "Unknown operation",
			operation: model.Operation{
				A: 1, B: 1, Operator: "I love Wallows", // non defined operator
			},
			expectedRes:   0,
			expectedError: ErrUnknownOperation,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res, err := svc.Calculate(tt.operation)

			if err != tt.expectedError {
				t.Errorf("expected error %v, got %v", tt.expectedError, err)
			}

			if res != tt.expectedRes {
				t.Errorf("expected result %v, got %v", tt.expectedRes, res)
			}
		})
	}
}
