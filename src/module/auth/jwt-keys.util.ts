import * as fs from 'fs';
import * as path from 'path';

export function getJwtKey(keyType: 'public' | 'private'): string {
  const fileName = `${keyType}.key`;
  const filePath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `JWT ${keyType} key file "${fileName}" not found in root directory.`,
    );
  }

  return fs.readFileSync(filePath, 'utf8');
}
