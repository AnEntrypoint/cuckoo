# AI Provider API Integration

This project provides a unified interface to interact with various AI model providers through their APIs. Each provider implementation supports configurable parameters while maintaining sensible defaults.

## Supported Providers

- OpenAI
- Azure OpenAI
- Anthropic
- Google (Gemini)
- Mistral
- Hugging Face
- Cohere
- DeepInfra
- Together
- Perplexity
- Groq
- Bedrock (AWS)

## Common Request Format

All providers accept a standardized request format with the following parameters:

```typescript
{
  prompt: string;              // The main input text
  history: string[];          // Chat history as an array of messages
  systemPrompt: string;       // System instructions for the model
  model?: string;             // Override the default model
  max_tokens?: number;        // Maximum tokens in the response
  temperature?: number;       // Randomness of the output (0.0 to 1.0)
  // Additional provider-specific parameters are supported via ...rest
}
```

## Provider-Specific Defaults

### OpenAI
- Model: `gpt-3.5-turbo`
- Max Tokens: 1000
- Temperature: 0.7

### Azure OpenAI
- Model: `gpt-35-turbo` (deployment name)
- Max Tokens: 1000
- Temperature: 0.7

### Anthropic
- Model: `claude-2`
- Max Tokens: 300
- Temperature: 0.7
- Stop Sequences: `["\n\nHuman:"]`

### Google (Gemini)
- Model: `gemini-pro`
- Max Tokens: 1000
- Temperature: 0.7

### Mistral
- Model: `mistral-7b`
- Max Tokens: 300
- Temperature: 0.7

### Hugging Face
- Model: `meta-llama/Llama-2-70b-chat-hf`
- Max Tokens: 500
- Temperature: 0.7

### Cohere
- Model: `command`
- Max Tokens: 500
- Temperature: 0.7

### DeepInfra
- Model: `meta-llama/Llama-2-70b-chat-hf`
- Max Tokens: 1000
- Temperature: 0.7

### Together
- Model: `togethercomputer/llama-2-70b-chat`
- Max Tokens: 1000
- Temperature: 0.7

### Perplexity
- Model: `pplx-70b-chat`
- Max Tokens: 1000
- Temperature: 0.7

### Groq
- Model: `mixtral-8x7b-32768`
- Max Tokens: 1000
- Temperature: 0.7

### Bedrock (AWS)
- Model: `anthropic.claude-v2`
- Max Tokens: 1000
- Temperature: 0.7

## Environment Variables

Each provider requires its own API key to be set as an environment variable:

```bash
OPENAI_API_KEY=           # OpenAI API key
AZURE_OPENAI_API_KEY=     # Azure OpenAI API key
AZURE_RESOURCE_NAME=      # Azure resource name
AZURE_DEPLOYMENT_NAME=    # Azure deployment name
ANTHROPIC_API_KEY=        # Anthropic API key
GOOGLE_API_KEY=           # Google API key
MISTRAL_API_KEY=         # Mistral API key
HUGGINGFACE_API_KEY=     # Hugging Face API key
COHERE_API_KEY=          # Cohere API key
DEEPINFRA_API_KEY=       # DeepInfra API key
TOGETHER_API_KEY=        # Together API key
PERPLEXITY_API_KEY=      # Perplexity API key
GROQ_API_KEY=            # Groq API key
AWS_ACCESS_KEY_ID=       # AWS access key ID
AWS_SECRET_ACCESS_KEY=   # AWS secret access key
AWS_REGION=              # AWS region (default: us-east-1)
```

## Usage Example

```typescript
// Example request to OpenAI
const response = await fetch("/functions/openai", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Hello, how are you?",
    history: [],
    systemPrompt: "You are a helpful assistant.",
    model: "gpt-4",              // Override default model
    max_tokens: 2000,            // Override default token limit
    temperature: 0.9,            // Override default temperature
    top_p: 0.95,                // Provider-specific parameter
  }),
});

const data = await response.json();
```

## Response Format

All providers return responses in a standardized format:

```typescript
{
  choices: [{
    message: {
      role: "assistant",
      content: string,
    },
    finish_reason: string,
  }]
}
```

## Error Handling

The API will return appropriate HTTP status codes and error messages in case of:
- Invalid API keys
- Rate limiting
- Model unavailability
- Invalid parameters
- Other API-specific errors

## Contributing

To add a new provider:
1. Create a new directory under `functions/`
2. Implement the provider using the `createFunction` utility
3. Follow the existing pattern for parameter handling
4. Update this README with the new provider's details

## License

MIT
