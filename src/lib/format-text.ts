export interface TextToken {
  text: string;
  bold: boolean;
}

const BOLD_REGEX = /\*\*([^\s*](?:[\s\S]*?[^\s*])?)\*\*/g;

export function parseBoldText(input?: string | null): TextToken[] {
  if (!input) {
    return [];
  }

  const tokens: TextToken[] = [];
  let lastIndex = 0;
  const regex = new RegExp(BOLD_REGEX);
  let match = regex.exec(input);
  while (match !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: input.slice(lastIndex, match.index),
        bold: false,
      });
    }

    tokens.push({
      text: match[1] ?? "",
      bold: true,
    });

    lastIndex = regex.lastIndex;
    match = regex.exec(input);
  }

  if (lastIndex < input.length) {
    tokens.push({
      text: input.slice(lastIndex),
      bold: false,
    });
  }

  return tokens;
}
