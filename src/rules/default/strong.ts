export const strong = {
  block: false,
  name: 'strong',
  tags: [/^\*\*(?!(\s|$))/, /(?<!\s)\*\*(?!\*)/],
  replacementTags: ['<strong>', '</strong>'],
}
