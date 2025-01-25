export const parseAiResponse = (response: string) => {
  const improvedMatch = response.match(/Improved:\s*(.*?)(?=\n\n|$)/s);
  return improvedMatch ? improvedMatch[1].trim() : null;
};