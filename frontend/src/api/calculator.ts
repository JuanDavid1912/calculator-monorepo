export type OperatorType = 
  | 'add' 
  | 'subtract' 
  | 'multiply' 
  | 'divide' 
  | 'power' 
  | 'square_root' 
  | 'percent';

export interface CalculateRequest {
  a: number;
  b: number;
  operation: OperatorType;
}

export interface CalculateResponse {
  result?: number;
  error?: string;
}

const API_URL = 'http://localhost:8080/api/calculate';

export const calculate = async (req: CalculateRequest): Promise<CalculateResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    
    return await response.json();
  } catch (error) {
    return { error: 'Network error connecting to backend' };
  }
};