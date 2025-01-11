// Transliteration map for Russian characters
const translitMap = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
  'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
  'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
  'э': 'e', 'ю': 'yu', 'я': 'ya'
};

export function transliterate(text) {
  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

export async function generateUniqueUserId(db, name) {
  const baseId = transliterate(name);
  let userId = baseId;
  let counter = 1;

  // Check if user ID exists and increment counter until finding unique ID
  while (true) {
    const existingUser = await db('users').where({ id: userId }).first();
    if (!existingUser) {
      return userId;
    }
    userId = `${baseId}_${counter}`;
    counter++;
  }
}