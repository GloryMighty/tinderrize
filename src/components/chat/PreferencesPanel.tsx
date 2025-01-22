interface PreferencesPanelProps {
  rizzStyle: string;
  onRizzStyleChange: (style: string) => void;
}

export const PreferencesPanel = ({ rizzStyle, onRizzStyleChange }: PreferencesPanelProps) => {
  return null; // We've moved the controls to the header
};