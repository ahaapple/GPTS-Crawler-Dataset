import fs from 'fs';
import readline from 'readline';

async function deduplicateJsonl(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath, 'utf8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const seenIds = new Set<string>();
  const uniqueLines: string[] = [];

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    try {
      const json = JSON.parse(line);
      if (json.id && !seenIds.has(json.id)) {
        seenIds.add(json.id);
        uniqueLines.push(line);
      }
    } catch (e) {
      console.error('Error parsing line:', line, e);
    }
  }

  fileStream.close();
  rl.close();

  console.log('original lines', lineCount, 'unique Lines', uniqueLines.length);

  fs.writeFileSync(filePath, uniqueLines.join('\n'), 'utf8');
  console.log(`Deduplication complete. Unique items saved to ${filePath}`);
}

const filePath = 'gizmos.jsonl';
deduplicateJsonl(filePath).catch(console.error);
