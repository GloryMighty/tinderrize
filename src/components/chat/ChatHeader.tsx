import { UserCredits } from "../UserCredits";

export const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        AI Chat Assistant
      </h2>
      {!import.meta.env.DEV && <UserCredits />}
    </div>
  );
};