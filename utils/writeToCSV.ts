import { appendFile } from "fs/promises";

export async function writeToCSV(filename: string, data: any[]) {
  let csvContent = "action,duration\n";

  for (const item of data) {
    const csvRow = `${item.action},${item.duration}\n`;
    csvContent += csvRow;
  }

  await appendFile(filename, csvContent);
}
