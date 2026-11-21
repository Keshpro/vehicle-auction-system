const API_URL = "http://localhost:5000/api/auth";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId?: number;
  fullName?: string;
  email?: string;
  role?: string;
  approvalStatus?: string;
}

async function sendRequest(
  endpoint: string,
  data: RegisterData | LoginData
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

export function registerBidder(data: RegisterData) {
  return sendRequest("register", data);
}

export function loginBidder(data: LoginData) {
  return sendRequest("login", data);
}