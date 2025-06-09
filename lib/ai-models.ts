export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'perplexity' | 'openrouter';
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
  // OpenAI Models
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description: 'Most capable GPT-4 model with 128k context',
    pricing: { input: 10, output: 30 }
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    contextWindow: 8192,
    supportsTools: true,
    supportsSearch: false,
    description: 'High-quality reasoning model',
    pricing: { input: 30, output: 60 }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    contextWindow: 16385,
    supportsTools: true,
    supportsSearch: false,
    description: 'Fast and efficient for most tasks',
    pricing: { input: 0.5, output: 1.5 }
  },

  // Anthropic Models
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: 'Most capable Claude model for complex tasks',
    pricing: { input: 15, output: 75 }
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: 'Balanced performance and speed',
    pricing: { input: 3, output: 15 }
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: 'Fastest Claude model for simple tasks',
    pricing: { input: 0.25, output: 1.25 }
  },

  // Perplexity Models (with search)
  {
    id: 'llama-3.1-sonar-small-128k-online',
    name: 'Perplexity Llama 3.1 Sonar Small',
    provider: 'perplexity',
    contextWindow: 127072,
    supportsTools: false,
    supportsSearch: true,
    description: 'Fast model with real-time web search',
    pricing: { input: 0.2, output: 0.2 }
  },
  {
    id: 'llama-3.1-sonar-large-128k-online',
    name: 'Perplexity Llama 3.1 Sonar Large',
    provider: 'perplexity',
    contextWindow: 127072,
    supportsTools: false,
    supportsSearch: true,
    description: 'High-quality model with real-time web search',
    pricing: { input: 1, output: 1 }
  },

  // OpenRouter Models (various providers)
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet (OpenRouter)',
    provider: 'openrouter',
    contextWindow: 200000,
    supportsTools: true,
    supportsSearch: false,
    description: 'Latest Claude model via OpenRouter',
    pricing: { input: 3, output: 15 }
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo (OpenRouter)',
    provider: 'openrouter',
    contextWindow: 128000,
    supportsTools: true,
    supportsSearch: false,
    description: 'GPT-4 Turbo via OpenRouter',
    pricing: { input: 10, output: 30 }
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'openrouter',
    contextWindow: 131072,
    supportsTools: true,
    supportsSearch: false,
    description: 'Meta\'s large language model',
    pricing: { input: 0.59, output: 0.79 }
  }
];

export const DEFAULT_MODEL = 'gpt-4-turbo-preview';

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id);
};

export const getModelsByProvider = (provider: AIModel['provider']): AIModel[] => {
  return AI_MODELS.filter(model => model.provider === provider);
};

export const getModelsWithTools = (): AIModel[] => {
  return AI_MODELS.filter(model => model.supportsTools);
};

export const getModelsWithSearch = (): AIModel[] => {
  return AI_MODELS.filter(model => model.supportsSearch);
};