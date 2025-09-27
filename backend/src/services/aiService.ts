import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface AIRequest {
  prompt: string;
  modelId?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | undefined;
}

class AIService {
  private models: Map<string, OpenAI> = new Map();

  async initializeModel(model: AIModel): Promise<void> {
    try {
      const config: any = {
        apiKey: model.apiKey || process.env.OPENAI_API_KEY,
      };

      if (model.baseUrl) {
        config.baseURL = model.baseUrl;
      }

      const openai = new OpenAI(config);
      this.models.set(model.id, openai);
      
      logger.info(`Initialized AI model: ${model.name} (${model.provider})`);
    } catch (error) {
      logger.error(`Failed to initialize AI model ${model.name}:`, error);
      throw error;
    }
  }

  async generateText(request: AIRequest, modelId?: string): Promise<AIResponse> {
    try {
      const model = this.getModel(modelId);
      
      const messages: any[] = [];
      
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt
        });
      }
      
      messages.push({
        role: 'user',
        content: request.prompt
      });

      const response = await model.chat.completions.create({
        model: 'gpt-3.5-turbo', // Default model, should be configurable
        messages,
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined;

      return { content, usage };
    } catch (error) {
      logger.error('AI generation error:', error);
      throw new Error('Failed to generate AI content');
    }
  }

  async generateStorySuggestions(prompt: string, context?: string): Promise<AIResponse> {
    const systemPrompt = `You are a creative writing assistant. Help the user with story development, character creation, plot suggestions, and writing improvement. 
    
    Context: ${context || 'No specific context provided'}
    
    Provide helpful, creative, and constructive suggestions for their writing.`;

    return this.generateText({
      prompt,
      systemPrompt,
      maxTokens: 500,
      temperature: 0.8
    });
  }

  async improveWriting(text: string, improvementType: 'grammar' | 'style' | 'clarity' | 'flow'): Promise<AIResponse> {
    const systemPrompts = {
      grammar: 'You are a grammar and syntax expert. Fix any grammatical errors, punctuation issues, and syntax problems while preserving the original meaning and style.',
      style: 'You are a writing style expert. Improve the writing style, word choice, and sentence structure while maintaining the author\'s voice.',
      clarity: 'You are a clarity expert. Make the text clearer, more concise, and easier to understand while preserving the original meaning.',
      flow: 'You are a writing flow expert. Improve the flow, transitions, and overall readability of the text.'
    };

    return this.generateText({
      prompt: `Please improve this text for ${improvementType}:\n\n${text}`,
      systemPrompt: systemPrompts[improvementType],
      maxTokens: Math.max(text.length * 2, 1000),
      temperature: 0.3
    });
  }

  async generateCharacterDescription(characterType: string, genre?: string): Promise<AIResponse> {
    const systemPrompt = `You are a character development expert. Create detailed, well-rounded characters that feel authentic and compelling.
    
    Genre: ${genre || 'General fiction'}
    Character Type: ${characterType}
    
    Provide a comprehensive character description including appearance, personality, background, motivations, and character arc potential.`;

    return this.generateText({
      prompt: `Create a detailed character description for a ${characterType}${genre ? ` in the ${genre} genre` : ''}.`,
      systemPrompt,
      maxTokens: 800,
      temperature: 0.7
    });
  }

  async generateWorldBuilding(genre: string, setting?: string): Promise<AIResponse> {
    const systemPrompt = `You are a world-building expert. Create rich, detailed worlds that feel authentic and immersive.
    
    Genre: ${genre}
    Setting: ${setting || 'Not specified'}
    
    Provide comprehensive world-building details including geography, culture, history, technology/magic systems, and social structures.`;

    return this.generateText({
      prompt: `Create detailed world-building for a ${genre} story${setting ? ` set in ${setting}` : ''}.`,
      systemPrompt,
      maxTokens: 1000,
      temperature: 0.8
    });
  }

  async analyzeText(text: string, analysisType: 'sentiment' | 'pacing' | 'tone' | 'readability'): Promise<AIResponse> {
    const systemPrompts = {
      sentiment: 'You are a sentiment analysis expert. Analyze the emotional tone and mood of the text.',
      pacing: 'You are a pacing analysis expert. Analyze the rhythm, tempo, and flow of the narrative.',
      tone: 'You are a tone analysis expert. Analyze the author\'s voice, attitude, and writing style.',
      readability: 'You are a readability expert. Analyze the complexity, clarity, and accessibility of the text.'
    };

    return this.generateText({
      prompt: `Please analyze this text for ${analysisType}:\n\n${text}`,
      systemPrompt: systemPrompts[analysisType],
      maxTokens: 300,
      temperature: 0.3
    });
  }

  private getModel(modelId?: string): OpenAI {
    if (modelId && this.models.has(modelId)) {
      return this.models.get(modelId)!;
    }

    // Return default model or first available model
    const defaultModel = Array.from(this.models.values())[0];
    if (!defaultModel) {
      throw new Error('No AI models available');
    }

    return defaultModel;
  }

  async testModel(model: AIModel): Promise<boolean> {
    try {
      await this.initializeModel(model);
      const response = await this.generateText({
        prompt: 'Hello, this is a test message.',
        maxTokens: 10
      });
      return !!response.content;
    } catch (error) {
      logger.error(`Model test failed for ${model.name}:`, error);
      return false;
    }
  }
}

export const aiService = new AIService();
