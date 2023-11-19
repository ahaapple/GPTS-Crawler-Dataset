import fs from 'fs';
import readline from 'readline';

async function deduplicateJsonl(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath, 'utf8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const uniqueIds = new Set<string>();
  const uniqueUrls: string[] = [];

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    try {
      const match = line.match(/g-\w+/);
      if (match) {
        const id = match[0];
        if (!uniqueIds.has(id)) {
          uniqueIds.add(id);
          uniqueUrls.push(line);
        }
      }
    } catch (e) {
      console.error('Error parsing line:', line, e);
    }
  }

  fileStream.close();
  rl.close();

  console.log('original lines', lineCount, 'unique Lines', uniqueUrls.length);

  fs.writeFileSync(filePath, uniqueUrls.join('\n'), 'utf8');
  console.log(`Deduplication complete. Unique items saved to ${filePath}`);
}

const filePath = 'gpts-url-list';
deduplicateJsonl(filePath).catch(console.error);
