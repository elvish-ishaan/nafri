import  BigNumber from 'bignumber.js';


export const convertSpace = (bytes: number | string | bigint | undefined, size: "GB" | "MB" | "KB"): number => {
    console.log("Input 'bytes' value:", bytes);
  
    // Ensure bytes is a valid number, numeric string, or bigint
    if (bytes === undefined || bytes === null) {
      console.warn("Warning: 'bytes' is undefined or null. Defaulting to 0.");
      bytes = 0;
    }
  
    const numBytes = new BigNumber(typeof bytes === 'bigint' ? bytes.toString() : bytes);
    const KB = new BigNumber(1024);
    const MB = KB.times(1024);
    const GB = MB.times(1024);
  
    switch (size) {
      case "GB":
        return numBytes.dividedBy(GB).toNumber();
      case "MB":
        return numBytes.dividedBy(MB).toNumber();
      case "KB":
        return numBytes.dividedBy(KB).toNumber();
      default:
        throw new Error("Invalid size. Use 'GB', 'MB', or 'KB'.");
    }
  };
  