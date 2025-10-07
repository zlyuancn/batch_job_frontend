// 秒级时间戳转文本
export function formatTimestamp(seconds: number): string {
  const date = new Date(seconds * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsStr = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr}`;
}

// Date转秒级时间戳
export function date2Timestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
