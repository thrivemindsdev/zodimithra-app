// Auth API Request & Response Types

export interface CheckPhonePayload {
  phone: string;
}

export interface CheckPhoneResponseData {
  is_registered: boolean;
  phone?: string;
  [key: string]: unknown;
}

export interface CheckPhoneResponse {
  status: number;
  message?: string;
  data: CheckPhoneResponseData;
}

export interface VerifyPasswordPayload {
  phone: string | null;
  password: string;
}

export interface VerifyPasswordResponseData {
  token: string;
  on_boarding?: boolean;
  user?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface VerifyPasswordResponse {
  status: number;
  message?: string;
  data: VerifyPasswordResponseData;
}

export interface SendOtpPayload {
  phone: string;
}

export interface SendOtpResponse {
  status: number;
  message?: string;
  data?: unknown;
}

export interface VerifyOtpPayload {
  phone: string | null;
  otp: string;
}

export interface VerifyOtpResponseData {
  token: string;
  is_registered?: boolean;
  [key: string]: unknown;
}

export interface VerifyOtpResponse {
  status: number;
  message?: string;
  data: VerifyOtpResponseData;
}

export interface CreatePinPayload {
  phone: string | null;
  password: string;
}

export interface CreatePinResponseData {
  token: string;
  on_boarding?: boolean;
  [key: string]: unknown;
}

export interface CreatePinResponse {
  status: number;
  message?: string;
  data: CreatePinResponseData;
}

export interface RegistrationResponseData {
  token: string;
  user?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RegistrationResponse {
  status: number;
  message?: string;
  data: RegistrationResponseData;
}

// Toast Modal State Type
export type ToastStatus = "success" | "error" | "warning" | "info" | boolean;

export interface ToastState {
  isOpen: boolean;
  status: ToastStatus;
  title: string;
  description: string;
  buttonText?: string;
  onDone?: () => void;
}
