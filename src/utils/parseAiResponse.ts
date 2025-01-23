export const parseAiResponse = (response: string) => {
  const sections = response.split('\n\n');
  const improvedVersionSection = sections.find(section => 
    section.startsWith('IMPROVED VERSION')
  );
  
  if (!improvedVersionSection) return null;
  
  // Extract the text after "IMPROVED VERSION"
  const improvedVersion = improvedVersionSection
    .replace('IMPROVED VERSION', '')
    .trim();
    
  return improvedVersion;
};