
# Todo Manager with AI Summaries

A modern React application for managing to-do items with AI-powered summarization and Slack integration capabilities.

## Features

- **Todo Management**: Create, read, update, and delete todos with priority levels
- **AI Summarization**: Generate AI summaries of your pending tasks (requires backend integration)
- **Slack Integration**: Send todo summaries to Slack (requires backend integration)
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Local Storage**: Browser's localStorage for temporary data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory:
```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies:
```sh
npm install
```

4. Start the development server:
```sh
npm run dev
```

## Backend Integration (Future)

This project is designed to be connected to a backend service that will:

1. Store todos in a database (Supabase/Firebase)
2. Generate summaries using an LLM (OpenAI, Cohere, etc.)
3. Post summaries to Slack via Webhooks

### Backend Requirements

- Node.js (Express) or Java (Spring Boot)
- Database: Supabase/Firebase
- LLM API Integration: OpenAI/Cohere/etc.
- Slack Webhooks

## Required Environment Variables (for Backend)

Create a `.env` file in your backend project with:

```
# LLM API Keys
OPENAI_API_KEY=your_openai_key_here

# Slack Integration
SLACK_WEBHOOK_URL=your_slack_webhook_url

# Database Connection
DATABASE_URL=your_database_connection_string
```

## Slack Webhook Setup

1. Go to your Slack workspace
2. Create a new app at https://api.slack.com/apps
3. Enable Incoming Webhooks
4. Create a new webhook for your desired channel
5. Copy the webhook URL to your environment variables

## Planned Features

- [ ] Backend implementation with Node.js/Express
- [ ] Database integration with Supabase
- [ ] OpenAI API integration for intelligent summaries
- [ ] Slack webhook implementation
- [ ] User authentication system
- [ ] Todo categories and tags
- [ ] Due dates and reminders

## License

This project is open source and available under the MIT License.
