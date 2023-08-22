export function paramReplacing(str: string, params: string[] | undefined) {
  if (!params) return str;

  params.forEach((param, i) => {
    const regex = `\\$_${i}`;
    const re = new RegExp(regex, "g");
    str = str.replace(re, param);
  });

  return str;
}

export function sizeToReadable(size: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (size == 0) return "0 Byte";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return Math.round(size / Math.pow(1024, i)) + " " + sizes[i];
}

export function multipleIncludes(arr: string[], target: string) {
  for (let i = 0; i < arr.length; i++) {
    if (target.includes(arr[i])) return true;
  }

  return false;
}