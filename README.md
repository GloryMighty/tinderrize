# Tinderizzer - Master the Art of Online Dating with AI

## Project Description

Tinderizzer is an AI-powered dating coach designed to help you craft the perfect messages for online dating.  It analyzes your messages and your match's profile to provide feedback and suggestions for improvement, boosting your "rizz score" and helping you make better connections.

## Tech Stack

This project is built using a modern and robust tech stack, focusing on performance, maintainability, and a great user experience.

*   **Frontend:**
    *   **React:**  A declarative, efficient, and flexible JavaScript library for building user interfaces.
    *   **TypeScript:**  A strongly typed superset of JavaScript that enhances code quality and developer productivity.
    *   **Vite:**  A fast build tool and development server for a rapid development experience. See `vite.config.ts` for configuration.
    *   **Shadcn UI:**  A collection of reusable UI components built with Radix UI and Tailwind CSS for a consistent and beautiful design system.  Many components are used throughout the project, for example, cards (`src/components/ui/card.tsx`), buttons (`src/components/ui/button.tsx`), dialogs (`src/components/ui/dialog.tsx`), and forms (`src/components/ui/form.tsx`).
    *   **Tailwind CSS:**  A utility-first CSS framework for rapid UI development and consistent styling. Configuration can be found in `tailwind.config.ts`.
    *   **React Router DOM:**  For declarative routing and navigation within the application.  Used for page navigation in `App.tsx` and `Landing.tsx`.
    *   **React Hook Form:**  For robust and performant form handling.
    *   **Zod:** For schema validation.
    *   **Lucide React:** Beautifully simple icons.
    *   **Class Variance Authority & Tailwind Merge:** For managing Tailwind CSS class name variations efficiently.
    *   **Sonner & React Toast:** For user-friendly toast notifications. See `src/components/ui/sonner.tsx` and `src/components/ui/toast.tsx`.
    *   **Next Themes:** For easy theme switching (light/dark mode).
    *   **Embla Carousel React:**  For creating smooth and responsive carousels.
    *   **Recharts:**  A composable charting library built on React components. Used for displaying data visualizations, as seen in `src/components/ui/chart.tsx`.
    *   **Tsparticles:** For creating engaging particle backgrounds, enhancing the visual appeal of the application, like in `src/pages/Index.tsx`.

*   **Backend & Services:**
    *   **Supabase:**  A powerful open-source Firebase alternative providing:
        *   **Authentication:**  User authentication and management handled by Supabase Auth. See `src/integrations/supabase/client.ts`, `Landing.tsx`, and `App.tsx` for implementation.
        *   **Database:**  PostgreSQL database to store user data and preferences.
    *   **Google Generative AI (Gemini API):**  Utilized for AI-powered message analysis and improvement suggestions.  The core logic is implemented in `src/components/ChatAssistant.tsx` and configured in `src/utils/aiConfig.ts`.

*   **Package Manager:**
    *   **UV:**  A fast and modern Python package installer and resolver (inferred from project setup).

*   **Styling & Design:**
    *   **Custom CSS:**  For project-specific styles and enhancements, as seen in `src/index.css` and `src/App.css`.

## Technical Features

*   **AI-Powered Message Analysis:**  Leverages the Google Gemini API to analyze dating messages and provide actionable feedback, improving user's communication skills.  See `src/components/ChatAssistant.tsx` and `src/utils/aiConfig.ts` for details on the AI integration and prompting.
*   **Rizz Score:**  Calculates a "Rizz Score" to quantify the effectiveness of messages, providing users with a fun and engaging metric to track their progress. Implemented in `src/components/RizzScore.tsx` and used in `src/components/ChatAssistant.tsx`.
*   **User Authentication with Supabase:** Secure user sign-up, sign-in, and session management using Supabase Auth. Protected routes are implemented using `ProtectedRoute` component in `App.tsx` to ensure only authenticated users can access core features.
*   **Personalized Rizz Styles:** Offers different "rizz styles" (Casual, Sassy, Toxic) to tailor message suggestions to user preferences.  Implemented in `src/components/RizzApproaches.tsx` and configurable via `RizzStyleModal` (`src/components/modals/RizzStyleModal.tsx`).
*   **Match Description Input:** Allows users to input details about their match's profile and preferences to further personalize AI suggestions.  Implemented using `MatchDescriptionModal` (`src/components/modals/MatchDescriptionModal.tsx`).
*   **Responsive Design:**  Application is designed to be fully responsive and accessible across different devices, utilizing techniques like `useIsMobile` hook (`src/hooks/use-mobile.tsx`) and `MobileSidebar` (`src/components/MobileSidebar.tsx`).
*   **Modern UI Components:**  Utilizes a rich set of UI components from Shadcn UI, ensuring a consistent and visually appealing user interface.
*   **Theme Switching:**  Supports light and dark themes for user preference, implemented using Next Themes and configured in `tailwind.config.ts` and `src/components/ThemeToggle.tsx`.
*   **Upgrade & Subscription Model:**  Includes basic structure for user upgrades and subscription plans, as seen in `src/pages/Upgrade.tsx`.
*   **Real-time Feedback:** Provides users with immediate feedback and improved message suggestions, enhancing the learning and improvement process.
*   **Toast Notifications:**  Uses `sonner` and `react-toast` for non-intrusive and informative user notifications.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [project-directory]
    ```

2.  **Install dependencies using UV:**
    ```bash
    uv install
    ```

3.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   Obtain your Supabase URL and API keys from your project settings.
    *   Update the `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`.
    *   Ensure your Supabase project has the necessary database schema set up (user preferences table, etc.).

4.  **Set up Google Gemini API:**
    *   Obtain an API key for the Google Gemini API from [Google AI Studio](https://makersuite.google.com/app/apikey).
    *   Set the API key in your environment variables or directly in `src/components/ChatAssistant.tsx` (not recommended for production).

5.  **Start the development server:**
    ```bash
    uv run dev
    ```

6.  **Open your browser and navigate to `http://localhost:8080`.**

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bug fixes, feature requests, or improvements.

## License

[MIT License or specify the project license]
