import fs from 'fs';
import readline from 'readline';

async function deduplicateJsonl(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath, 'utf8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const uniqueIds = new Set<string>();

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    try {
      uniqueIds.add(line);
    } catch (e) {
      console.error('Error parsing line:', line, e);
    }
  }

  fileStream.close();
  rl.close();

  const sortedUniqueIds = Array.from(uniqueIds).sort().join('\n');

  console.log('original lines', lineCount, 'unique Lines', uniqueIds.size);

  fs.writeFileSync(filePath, sortedUniqueIds, 'utf8');
  console.log(`Deduplication complete. Unique items saved to ${filePath}`);
}

const filePath = 'gpts-url-list';
deduplicateJsonl(filePath).catch(console.error);
