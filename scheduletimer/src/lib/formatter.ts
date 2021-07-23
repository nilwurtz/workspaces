export function formatDate(date: Date, format?: string) {
  format = format ? format : "yyyy/MM/dd HH:mm:ss";
  format = format.replace(/yyyy/g, date.getFullYear().toString());
  format = format.replace(/yy/g, date.getFullYear().toString().slice(-2));
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/M/g, (date.getMonth() + 1).toString());
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/d/g, date.getDate().toString());
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/H/g, date.getHours().toString());
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/m/g, date.getMinutes().toString());
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  format = format.replace(/s/g, date.getSeconds().toString());
  return format;
}
