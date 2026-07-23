export const timeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
    ? "Asia/Kolkata"
    : Intl.DateTimeFormat().resolvedOptions().timeZone;
