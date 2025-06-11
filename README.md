# Intellix: Advanced AI Chat Platform

<p align="center">
<img align="center" src="./public/intellix-logo.png" width="300" height="300" alt="Intellix Logo">
<p>

*A **powerful AI chat platform** with multi-model support, real-time web search, file processing, and advanced reasoning capabilities. Features streaming responses, intelligent suggestions, and seamless integration with multiple AI providers for enhanced productivity and research.*

[![Visit Intellix](https://img.shields.io/static/v1?label=Website&message=Intellix&color=blue&style=flat-square)](#) ![License](https://img.shields.io/badge/license-MIT-green) [![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289DA?logo=discord&logoColor=white)](#) [![GitHub stars](https://img.shields.io/github/stars/your-username/intellix?style=social)](#)

### Why Intellix ?

* 🤖 **Multi-Model AI Support** - Seamless integration with OpenAI, Anthropic, Groq, and other leading AI providers in one unified interface.

* 🌐 **Real-time Web Search** - Built-in web search capabilities with source citations, image search, and video discovery for up-to-date information.

* 📁 **File Processing & Analysis** - Upload and analyze documents, images, and other files with AI-powered insights and summaries.

* 🎯 **Focus Modes** - Specialized modes for different use cases: Writing, Academic, YouTube, Reddit, News, and general conversation.

* 💡 **Smart Suggestions** - AI-powered follow-up questions and conversation starters to enhance your interaction experience.

* 🎨 **Modern UI/UX** - Clean, responsive design with dark/light themes, mobile optimization, and intuitive navigation.

* 📊 **Chat Management** - Persistent conversation history, chat organization, and seamless conversation switching.

### **Demo**

> *Search for the latest developments in AI reasoning models, then analyze this research paper and create a summary with key insights*

*Demo video coming soon...*

> 🛠⚠️️ **Active Development**

> 🚀 Currently migrating from Next.js to Nuxt.js for enhanced performance and developer experience. Both versions are available with the Next.js version being production-ready.

## Prerequisites

Make sure you have Node.js 18+, PostgreSQL, and Git installed on your system.

For local AI model support, see the **Local Models** section.

### 1. **Clone the repository and setup**

```sh
git clone https://github.com/tinh2044/Intellix.git
cd Intellix
cp .env.example .env.local
```

### 2. Configure environment variables

Edit the `.env.local` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/intellix"

# AI Provider API Keys (choose your preferred providers)
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GROQ_API_KEY="gsk_your-groq-key"

# Search Integration
SEARXNG_API_URL="http://127.0.0.1:8080"
TAVILY_API_KEY="tvly-your-tavily-key"

# Weather API (optional)
WEATHER_API_KEY="your-weather-api-key"

# Application Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**API Keys are optional if you plan to use local models only. Most features work without external APIs.**

The following environment variables configure your application:

- **DATABASE_URL**: PostgreSQL connection string for chat storage
- **OPENAI_API_KEY**: For GPT models (optional)
- **ANTHROPIC_API_KEY**: For Claude models (optional)
- **GROQ_API_KEY**: For fast inference (optional)
- **SEARXNG_API_URL**: Local search instance (recommended)
- **TAVILY_API_KEY**: Alternative web search provider

### 3. **Install dependencies and setup database**

```sh
# Install dependencies
npm install

# Setup database
npm run db:migrate
npm run db:seed
```

### 4. **Start the application**

```sh
# Next.js version (production ready)
npm run dev

# Nuxt.js version (in development)
cd intellix-nuxt3
npm install
npm run dev
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

# Pull your preferred model
ollama pull deepseek-r1:14b
ollama pull qwen2.5:14b
```

**Update Configuration**

Modify your `.env.local` to use local models:

```env
# Local Model Configuration
USE_LOCAL_MODELS=true
OLLAMA_BASE_URL="http://localhost:11434"
DEFAULT_MODEL="deepseek-r1:14b"
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

Update your `config/models.json`:

```json
{
  "chatModels": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "openai",
      "model": "gpt-4-turbo"
    },
    {
      "id": "claude-3",
      "name": "Claude 3 Sonnet",
      "provider": "anthropic",
      "model": "claude-3-sonnet-20240229"
    }
  ]
}
```

**Supported Cloud Providers**

| Provider | Description |
|----------|-------------|
| OpenAI | GPT-3.5, GPT-4, GPT-4 Turbo |
| Anthropic | Claude 3 family |
| Groq | Fast inference with Llama, Mixtral |
| Together AI | Various open-source models |
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

**Multi-turn Conversations:**
> *Follow up on previous responses with contextual questions*

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + /`: Toggle sidebar
- `Ctrl/Cmd + N`: New chat

---

## Configuration

### Model Settings

Access model configuration through Settings → Models:

- **Chat Models**: Select primary and fallback models
- **Embedding Models**: Configure for search and retrieval
- **Parameters**: Temperature, max tokens, top-p
- **System Prompts**: Customize AI behavior

### Search Configuration

Configure search providers in Settings → Search:

- **Web Search**: Enable/disable web search
- **Image Search**: Configure image providers
- **Search Depth**: Balance speed vs. comprehensiveness
- **Source Filtering**: Filter trusted sources

### Focus Modes

| Mode | Description | Use Cases |
|------|-------------|-----------|
| All | General conversation | Daily tasks, questions |
| Writing | Creative and professional writing | Articles, emails, stories |
| Academic | Research and analysis | Papers, citations, research |
| YouTube | Video content discovery | Learning, entertainment |
| Reddit | Community discussions | Trends, opinions |
| News | Current events | Breaking news, updates |

---

## Docker Deployment

```sh
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3
```

---

## Development

### Project Structure

```
Intellix/
├── src/                     # Next.js application
│   ├── app/                # App router and API routes
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities
├── intellix-nuxt3/        # Nuxt.js version (in development)
│   ├── components/        # Vue components
│   ├── composables/       # Vue composables
│   ├── pages/             # Nuxt pages
│   └── stores/            # Pinia stores
├── server/                # Backend API
├── drizzle/              # Database schema and migrations
└── uploads/              # File storage
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send chat message |
| `/api/chats` | GET | Get chat history |
| `/api/chats/[id]` | GET/DELETE | Chat operations |
| `/api/search` | POST | Web search |
| `/api/images` | POST | Image search |
| `/api/upload` | POST | File upload |
| `/api/models` | GET | Available models |

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

Ensure PostgreSQL is running and the connection string is correct:

```sh
# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U username -d intellix
```

### Model Loading Issues

**Error:** `Model not found or failed to load`

For local models:
```sh
# Verify Ollama is running
ollama list

# Pull the model if missing
ollama pull deepseek-r1:14b
```

### Search Service Issues

**Error:** `Search service unavailable`

Start the SearxNG instance:
```sh
docker run -d -p 8080:8080 searxng/searxng
```

---

## FAQ

**Q: Can I use multiple AI providers simultaneously?**

Yes! Intellix supports multiple providers and can automatically select the best model for each task.

**Q: How much does it cost to run?**

With local models: Free after initial setup. With cloud APIs: Varies by usage and provider (typically $0.01-0.10 per conversation).

**Q: Is my data private?**

Yes. All conversations are stored locally in your database. When using local models, no data is sent to external services.

**Q: Can I customize the AI's behavior?**

Absolutely! Use custom system prompts, adjust model parameters, and configure focus modes to match your workflow.

**Q: What file types are supported?**

PDF, DOCX, TXT, MD, images (PNG, JPG, WebP), and more. The AI can analyze content and answer questions about uploaded files.

---

**License:** MIT License - see [LICENSE](LICENSE) for details
