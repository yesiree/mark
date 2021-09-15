export const strong = {
  name: 'strong',
  tags: [/^\*\*(?!(\s|$))/, /(?<!\s)\*\*(?!\*)/],
  replacementTags: ['<strong>', '</strong>'],
}
