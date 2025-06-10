export interface AIModel {
  id: string;
  name: string;
  provider: "openrouter";
  contextWindow: number;
  supportsTools: boolean;
  supportsSearch: boolean;
  description: string;
  pricing?: {
    input: number; // per 1M tokens
    output: number; // per 1M tokens
  };
}

export const AI_MODELS: AIModel[] = [
  // Latest OpenAI Models via OpenRouter
  {
    id: "openai/o3",
    name: "OpenAI o3",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest OpenAI reasoning model with advanced problem-solving",
    pricing: { input: 10, output: 40 },
  },
  {
    id: "openai/o3-mini",
    name: "OpenAI o3 Mini",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Efficient reasoning model for complex tasks",
    pricing: { input: 1.1, output: 4.4 },
  },
  {
    id: "openai/o1",
    name: "OpenAI o1",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Advanced reasoning model for complex problem solving",
    pricing: { input: 15, output: 60 },
  },
  {
    id: "openai/o1-mini",
    name: "OpenAI o1 Mini",
    provider: "openrouter",
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description: "Efficient reasoning model for most tasks",
    pricing: { input: 1.1, output: 4.4 },
  },
  {
    id: "openai/gpt-4o-2024-11-20",
    name: "GPT-4o (2024-11-20)",
    provider: "openrouter",
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description:
      "Latest GPT-4o with improved creative writing and file processing",
    pricing: { input: 2.5, output: 10 },
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openrouter",
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description: "Fast and efficient model for most tasks",
    pricing: { input: 0.15, output: 0.6 },
  },

  // Latest Anthropic Models via OpenRouter
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Claude model with enhanced capabilities",
    pricing: { input: 3, output: 15 },
  },
  {
    id: "anthropic/claude-opus-4",
    name: "Claude Opus 4",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Most capable Claude model for complex tasks",
    pricing: { input: 15, output: 75 },
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Enhanced Claude 3.5 with larger output capacity",
    pricing: { input: 3, output: 15 },
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Balanced performance and speed for most tasks",
    pricing: { input: 3, output: 15 },
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "openrouter",
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: "Fast Claude model for simple tasks",
    pricing: { input: 0.8, output: 4 },
  },

  // Latest Google Models via OpenRouter
  {
    id: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro Preview",
    provider: "openrouter",
    contextWindow: 1048576,
    supportsTools: true,
    supportsSearch: false,
    description: "Google's state-of-the-art model with advanced reasoning",
    pricing: { input: 1.25, output: 10 },
  },
  {
    id: "google/gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash Preview",
    provider: "openrouter",
    contextWindow: 1048576,
    supportsTools: true,
    supportsSearch: false,
    description: "Fast Gemini model with thinking capabilities",
    pricing: { input: 0.15, output: 0.6 },
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "openrouter",
    contextWindow: 1048576,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Gemini 2.0 model with multimodal capabilities",
    pricing: { input: 0.1, output: 0.4 },
  },

  // Latest Meta Models via OpenRouter
  {
    id: "meta-llama/llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "openrouter",
    contextWindow: 1048576,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Llama 4 model with enhanced capabilities",
    pricing: { input: 0.15, output: 0.6 },
  },
  {
    id: "meta-llama/llama-4-scout",
    name: "Llama 4 Scout",
    provider: "openrouter",
    contextWindow: 1048576,
    supportsTools: true,
    supportsSearch: false,
    description: "Efficient Llama 4 model for general tasks",
    pricing: { input: 0.08, output: 0.3 },
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    provider: "openrouter",
    contextWindow: 131072,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Llama 3.3 model with improved performance",
    pricing: { input: 0.07, output: 0.25 },
  },

  // Latest DeepSeek Models via OpenRouter
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "openrouter",
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description: "Advanced reasoning model with strong performance",
    pricing: { input: 0.45, output: 2.15 },
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "openrouter",
    contextWindow: 163840,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest DeepSeek model with enhanced capabilities",
    pricing: { input: 0.38, output: 0.89 },
  },

  // Latest Qwen Models via OpenRouter
  {
    id: "qwen/qwen3-32b",
    name: "Qwen3 32B",
    provider: "openrouter",
    contextWindow: 40960,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Qwen model with thinking capabilities",
    pricing: { input: 0.1, output: 0.3 },
  },
  {
    id: "qwen/qwq-32b",
    name: "QwQ 32B",
    provider: "openrouter",
    contextWindow: 131072,
    supportsTools: true,
    supportsSearch: false,
    description: "Qwen reasoning model for complex problem solving",
    pricing: { input: 0.15, output: 0.2 },
  },

  // Latest Microsoft Models via OpenRouter
  {
    id: "microsoft/phi-4",
    name: "Phi 4",
    provider: "openrouter",
    contextWindow: 16384,
    supportsTools: true,
    supportsSearch: false,
    description: "Microsoft's latest small language model",
    pricing: { input: 0.07, output: 0.14 },
  },

  // Latest xAI Models via OpenRouter
  {
    id: "x-ai/grok-3-beta",
    name: "Grok 3 Beta",
    provider: "openrouter",
    contextWindow: 131072,
    supportsTools: true,
    supportsSearch: false,
    description: "Latest Grok model with enhanced capabilities",
    pricing: { input: 3, output: 15 },
  },
  {
    id: "x-ai/grok-3-mini-beta",
    name: "Grok 3 Mini Beta",
    provider: "openrouter",
    contextWindow: 131072,
    supportsTools: true,
    supportsSearch: false,
    description: "Efficient Grok model for most tasks",
    pricing: { input: 0.3, output: 0.5 },
  },

  // Perplexity Models with Search
  {
    id: "perplexity/sonar-reasoning",
    name: "Perplexity Sonar Reasoning",
    provider: "openrouter",
    contextWindow: 127000,
    supportsTools: false,
    supportsSearch: true,
    description: "Advanced reasoning model with real-time web search",
    pricing: { input: 1, output: 5 },
  },
  {
    id: "perplexity/sonar",
    name: "Perplexity Sonar",
    provider: "openrouter",
    contextWindow: 127072,
    supportsTools: false,
    supportsSearch: true,
    description: "Fast model with real-time web search capabilities",
    pricing: { input: 1, output: 1 },
  },
];

export const DEFAULT_MODEL = "openai/gpt-4o-2024-11-20";

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};

export const getModelsByProvider = (
  provider: AIModel["provider"],
): AIModel[] => {
  return AI_MODELS.filter((model) => model.provider === provider);
};

export const getModelsWithTools = (): AIModel[] => {
  return AI_MODELS.filter((model) => model.supportsTools);
};

export const getModelsWithSearch = (): AIModel[] => {
  return AI_MODELS.filter((model) => model.supportsSearch);
};
