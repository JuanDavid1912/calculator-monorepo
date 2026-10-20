package main

import (
	"fmt"
	"log"
	"net/http"

	"calculator-backend/controller"
	"calculator-backend/service"
)

func main() {
	calcService := service.NewCalculatorService()

	calcController := controller.NewCalculatorController(calcService)

	http.HandleFunc("POST /api/calculate", calcController.HandleCalculate)
	http.HandleFunc("OPTIONS /api/calculate", calcController.HandleCalculate)

	port := ":8080"
	fmt.Printf("Calculator Backend is running on port %s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
