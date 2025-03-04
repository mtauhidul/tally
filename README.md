# niblet.ai - Simple Calorie Tracking

niblet.ait.ai is a lightweight web application that helps users lose (or gain) weight by tracking calories with an incredibly easy data ingestion system, tracking daily weight, providing simple visual charts for progress, and offering encouragement based on weight changes.

## Key Features

- **Conversational Meal Logging**: Log meals in plain English (e.g., "I had a turkey sandwich for lunch and a latte with oat milk")
- **Image-based Meal Entries**: Take photos of your food for automatic calorie estimation
- **Daily Weight Tracking**: Simple weight logging with visualization of progress
- **Visual Progress Charts**: Track your weight and calorie consumption over time
- **Daily Calorie Budget**: Set or get suggested daily calorie targets
- **Nutrition Q&A**: Ask questions about calories in specific meals or get food suggestions

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks
- **Authentication**: Simple cookie-based auth (for demo)
- **Visualization**: Recharts for data visualization

## Project Structure

```
├── app
│   ├── dashboard
│   │   ├── history
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings
│   ├── forgot-password
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   ├── onboarding
│   ├── page.tsx
│   ├── register
│   └── welcome
├── components
│   ├── add-meal-dialog.tsx
│   ├── calorie-calendar.tsx
│   ├── chat-interface.tsx
│   ├── goal-setting.tsx
│   ├── onboarding-flow.tsx
│   ├── ui
│   └── weight-chart.tsx
├── lib
├── middleware.ts
├── next.config.js
├── package.json
├── public
└── tsconfig.json
```

## Core Principles

- **Simplicity**: The user should spend only a few seconds per meal or per day entering data
- **Minimal Friction**: Minimal screens, minimal required clicks
- **Intuitive Interface**: Conversational UI that feels natural
- **Visual Feedback**: Clean charts and visual indicators of progress
- **Encouragement**: Positive reinforcement to help users stay on track

## Getting Started

### Prerequisites

- Node.js 18.0.0 or newer
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/niblet.ait.ai.git
   cd niblet.ait.ai
   ```

2. Install dependencies

   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## User Flow

1. User creates an account
2. Completes onboarding process:
   - Basic information (height, weight, sex, age)
   - Goal setting (target weight, timeline)
   - Daily calorie budgeting
3. Uses dashboard to:
   - Log meals via text or image
   - Record daily weight
   - Track progress through charts
   - Ask nutrition questions

## Code Organization

- `/app`: Contains the Next.js app router structure with pages
- `/components`: Reusable components
  - `/ui`: shadcn/ui components
- `/lib`: Utility functions and shared logic
- `/public`: Static assets

## Future Enhancements

- **Advanced macro tracking**: More detailed protein/fat/carb tracking
- **Recommendations**: Personalized meal suggestions based on past entries
- **Additional tracking**: Sleep/exercise/water intake
- **Integration**: Connect with wearables or health APIs
- **Social features**: Sharing progress or connecting with trainers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
