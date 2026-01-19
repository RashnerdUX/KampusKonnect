import { request } from "http";

export const isMobileUserAgent = (request: Request): boolean => {
  const userAgent = request.headers.get("user-agent") || "";
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}