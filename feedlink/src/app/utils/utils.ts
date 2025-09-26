
export function capitalizeFirstLetter(str: string | null): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function isExpired(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const now = new Date();
    const date = new Date(dateStr);
    return date < now;
  }
  
  export function isExpiringSoon(dateStr: string | null, days = 3): boolean {
    if (!dateStr) return false;
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= days;
  }