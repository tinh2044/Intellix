# Intellix: Advanced AI Chat Platform

<p align="center">
<img align="center" src="./public/intellix-logo.png" width="300" height="300" alt="Intellix Logo">
<p>

*A **powerful AI chat platform** built with Nuxt 3, featuring multi-model AI support, real-time web search, file processing, and advanced reasoning capabilities. Seamlessly integrates with leading AI providers for enhanced productivity and research.*

![Nuxt](https://img.shields.io/badge/Nuxt-3.17.5-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5.16-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-6.14.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0.3-FFD859?style=for-the-badge&logo=pinia&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.44.2-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-0.3.27-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge)

### Why Intellix ?

* 🤖 **Multi-Model AI Support** - Seamless integration with OpenAI, Anthropic, Groq, Google Gemini and other leading AI providers in one unified interface.

* 🌐 **Real-time Web Search** - Built-in web search capabilities with source citations, image search, and video discovery for up-to-date information.

* 📁 **File Processing & Analysis** - Upload and analyze documents, images, and other file types with AI-powered insights and summaries.

* 🎯 **Focus Modes** - Specialized modes for different use cases: Writing, Academic, YouTube, Reddit, News, and general conversation.

* 💡 **Smart Suggestions** - AI-powered follow-up questions and conversation starters to enhance your interaction experience.

* 🎨 **Modern UI/UX** - Clean, responsive design with dark/light themes, mobile optimization, and intuitive navigation.

* 📊 **Chat Management** - Persistent conversation history, chat organization, and seamless conversation switching.

### **Demo**

> *Search for the latest developments in AI reasoning models, then analyze this research paper and create a summary with key insights*

*Demo video coming soon...*

> 🛠⚠️️ **Active Development**

> 🚀 Project is fully built on Nuxt 3 with high performance and optimal development experience. Features powerful backend API integration and full support for advanced AI capabilities.

## Prerequisites

Make sure you have Node.js 18+, SQLite/PostgreSQL, and Git installed on your system.

For local AI model support, see the **Local Models** section.

### 1. **Clone the repository and setup**

```sh
git clone https://github.com/tinh2044/Intellix.git
cd Intellix
cp .env.example .env
```

### 2. **Configure environment variables**

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="file:./data/database.db"  # SQLite local
# or PostgreSQL: "postgresql://username:password@localhost:5432/intellix"

# AI Provider API Keys (choose your preferred providers)
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GROQ_API_KEY="gsk_your-groq-key"
GEMINI_API_KEY="your-gemini-key"

# Search Integration
SEARXNG_API_URL="http://127.0.0.1:8080"
TAVILY_API_KEY="tvly-your-tavily-key"

# Weather API (optional)
WEATHER_API_KEY="your-weather-api-key"

# Local Models (optional)
OLLAMA_API_URL="http://localhost:11434"

# Application Settings
NUXT_PUBLIC_APP_URL="http://localhost:3000"
```

**API Keys are completely optional if you only use local models. Most features work without external APIs.**

The following environment variables configure your application:

- **DATABASE_URL**: Database connection string for chat storage
- **OPENAI_API_KEY**: For GPT models (optional)
- **ANTHROPIC_API_KEY**: For Claude models (optional)
- **GROQ_API_KEY**: For fast inference (optional)
- **SEARXNG_API_URL**: Local search instance (recommended)
- **OLLAMA_API_URL**: For local AI models with Ollama

### 3. **Install dependencies and setup database**

```sh
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed
```

### 4. **Start the application**

```sh
# Start development server
npm run dev

# Or build and run production
npm run build
npm start
```

The application will be available at `http://localhost:3000`

---

## Setup for Local AI Models

**Hardware Requirements:**

For optimal performance with local models, we recommend:

| Model Size | RAM | GPU VRAM | Performance |
|------------|-----|----------|-------------|
| 7B | 16GB | 8GB | ⚠️ Basic functionality, slower responses |
| 13B | 32GB | 12GB | ✅ Good performance for most tasks |
| 34B | 64GB | 24GB | 🚀 Excellent performance |
| 70B+ | 128GB+ | 48GB+ | 💪 Premium experience |

**Setup Ollama (Recommended)**

```sh
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Pull your preferred models
ollama pull deepseek-r1:14b
ollama pull qwen2.5:14b
ollama pull llama3.2:3b
```

**Update Configuration**

Add to `.env` to use local models:

```env
# Local Model Configuration
OLLAMA_API_URL="http://localhost:11434"
```

**Supported Local Providers**

| Provider | Local? | Description |
|----------|--------|-------------|
| Ollama | Yes | Easy local model management |
| LM Studio | Yes | GUI-based local models |
| llama.cpp | Yes | High-performance inference |
| OpenAI Compatible | Depends | Local or remote API |

---

## Setup with Cloud APIs

**Running with cloud APIs is optional - see above for local setup.**

Simply add API keys to the `.env` file and the application will automatically detect them:

```env
# Cloud providers
OPENAI_API_KEY="sk-your-key"
ANTHROPIC_API_KEY="sk-ant-your-key"
GROQ_API_KEY="gsk_your-key"
GEMINI_API_KEY="your-key"
```

**Supported Cloud Providers**

| Provider | Description |
|----------|-------------|
| OpenAI | GPT-3.5, GPT-4, GPT-4 Turbo |
| Anthropic | Claude 3 family |
| Groq | Fast inference with Llama, Mixtral |
| Google | Gemini Pro, Gemini Flash |
| DeepSeek | Reasoning-focused models |

---

## Usage

### Starting a Conversation

1. Navigate to `http://localhost:3000`
2. Select a focus mode (All, Writing, Academic, etc.)
3. Type your message or upload a file
4. Press Enter or click Send

### Advanced Features

**File Analysis:**
> *Upload this PDF and summarize the key findings*

**Web Search with Sources:**
> *Search for the latest AI research papers from 2024 and provide summaries*

**Image Search:**
> *Find images of sustainable architecture designs*

**Code Generation:**
> *Write a Python script to analyze CSV data with pandas*

**Weather:**
> *What's the weather like in San Francisco today?*

**Video Search:**
> *Find Vue.js tutorial videos on YouTube*

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + /`: Toggle sidebar
- `Ctrl/Cmd + N`: New chat

---

## API Endpoints

### Chat API
- `POST /api/chat` - Send chat message with streaming response
- `GET /api/chats` - Get chat history
- `GET /api/chats/[id]` - Get specific chat
- `DELETE /api/chats/[id]` - Delete chat

### Search & Analysis
- `POST /api/search` - Web search
- `POST /api/images` - Image search
- `POST /api/videos` - Video search
- `POST /api/weather` - Weather information
- `POST /api/suggestions` - AI suggestions

### File & Configuration
- `POST /api/uploads` - Upload and process files
- `GET /api/models` - Get available models list
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

### Database & Testing
- `GET /api/database/stats` - Database statistics
- `GET /api/test-providers` - Test AI provider connections
- `GET /api/test-db` - Test database connection

---

## Docker Deployment

```sh
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Run only SearXNG for search
docker-compose up searxng
```

---

## Development

### Project Structure

```
Intellix/
├── components/              # Vue components
├── composables/            # Vue composables  
├── pages/                  # Nuxt pages (file-based routing)
├── layouts/                # Layout templates
├── server/                 # Nuxt server API routes
│   ├── api/               # API endpoints
│   └── utils/             # Server utilities
├── stores/                 # Pinia stores
├── types/                  # TypeScript type definitions
├── utils/                  # Client utilities
├── data/                   # Static data and database
├── drizzle/               # Database schema and migrations
├── uploads/               # File upload storage
├── public/                # Static assets
└── assets/                # Build assets (CSS, etc.)
```



### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## Known Issues

### Database Connection Issues

**Error:** `Connection to database failed`

Ensure the database file exists or connection string is correct:

```sh
# Create SQLite database
npm run db:push

# Or check PostgreSQL
psql -h localhost -U username -d intellix
```

### Model Loading Issues

**Error:** `Model not found or failed to load`

For local models:
```sh
# Check if Ollama is running
ollama list

# Pull model if missing
ollama pull deepseek-r1:14b
```

### Search Service Issues

**Error:** `Search service unavailable`

Start SearXNG instance:
```sh
docker-compose up searxng
```

### Environment Variables Issues

**Error:** `Missing required environment variables`

Check `.env` file:
```sh
# Copy example file if not exists
cp .env.example .env

# Test providers
curl http://localhost:3000/api/test-providers
```

---

## Available Scripts

```sh
# Development
npm run dev                 # Start dev server
npm run build              # Build production
npm run start              # Run production
npm run preview            # Preview build

# Database
npm run db:generate        # Generate migration files
npm run db:push           # Push schema to database
npm run db:migrate        # Run migrations
npm run db:studio         # Open Drizzle Studio
npm run db:seed           # Seed database with sample data

# Code Quality
npm run lint              # Lint code
npm run lint:fix          # Fix lint issues
npm run format            # Format code with Prettier
npm run typecheck         # Type checking

# Testing
npm test                  # Run tests
npm run test:ui           # Test UI
```

---

## FAQ

**Q: Can Intellix run completely offline?**

Yes! With Ollama and local SearXNG, all features run completely offline on your machine.

**Q: Can I use multiple AI providers simultaneously?**

Yes! Intellix supports multiple providers and can automatically select the best model for each task.

**Q: What are the operating costs?**

With local models: Free after initial setup. With cloud APIs: Varies by usage (typically $0.01-0.10 per conversation).

**Q: Is my data private?**

Yes. All conversations are stored locally in your database. When using local models, no data is sent to external services.

**Q: Can I customize AI behavior?**

Absolutely! Use custom system prompts, adjust model parameters, and configure focus modes to match your workflow.

**Q: What file types are supported?**

PDF, DOCX, TXT, MD, images (PNG, JPG, WebP), and more. AI can analyze content and answer questions about uploaded files.

**Q: How do I backup my data?**

```sh
# Backup database
cp data/database.db backups/database-$(date +%Y%m%d).db

# Or use API
curl -X POST http://localhost:3000/api/database/backup
```

**Q: Can I deploy to production?**

Yes! Use Docker or deploy directly:

```sh
# Docker production
docker-compose -f docker-compose.prod.yml up -d

# Or manual deployment
npm run build
npm start
```

---

**License:** MIT License - see [LICENSE](LICENSE) for details

**Support:** Create an issue on GitHub or join our Discord community 