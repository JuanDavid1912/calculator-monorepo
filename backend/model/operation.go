package model

type OperatorType string

const (
	OpAdd      OperatorType = "add"
	OpSubtract OperatorType = "subtract"
	OpMultiply OperatorType = "multiply"
	OpDivide   OperatorType = "divide"
	OpPower    OperatorType = "power"
	OpSqrt     OperatorType = "square_root"
	OpPercent  OperatorType = "percent"
)

type Operation struct {
	A        float64      `json:"a"`
	B        float64      `json:"b"`
	Operator OperatorType `json:"operation"`
}

type Result struct {
	Value float64 `json:"result,omitempty"`
	Error string  `json:"error,omitempty"`
}
