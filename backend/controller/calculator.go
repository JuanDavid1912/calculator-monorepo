package controller

import (
	"encoding/json"
	"net/http"

	"calculator-backend/model"
	"calculator-backend/service"
)

type CalculatorController struct {
	calcService service.CalculatorService
}

func NewCalculatorController(s service.CalculatorService) *CalculatorController {
	return &CalculatorController{
		calcService: s,
	}
}

func (c *CalculatorController) HandleCalculate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var op model.Operation
	if err := json.NewDecoder(r.Body).Decode(&op); err != nil {
		c.writeJSON(w, http.StatusBadRequest, model.Result{Error: "Invalid JSON format"})
		return
	}

	resValue, err := c.calcService.Calculate(op)
	if err != nil {
		c.writeJSON(w, http.StatusBadRequest, model.Result{Error: err.Error()})
		return
	}

	c.writeJSON(w, http.StatusOK, model.Result{Value: resValue})
}

func (c *CalculatorController) writeJSON(w http.ResponseWriter, status int, resp model.Result) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(resp)
}
