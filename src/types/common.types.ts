export interface BirthDetailsParams {
  dob: string;
  lat: number;
  lon: number;
  tz: string;
  lang?: string;
  isUserLoading?: boolean;
}

export interface LanguageParams {
  lang: string;
}