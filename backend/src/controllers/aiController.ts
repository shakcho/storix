import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { logger } from '../utils/logger';

export const aiController = {
  // AI Model Management
  getModels: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      
      // TODO: Implement model retrieval from database
      const models: any[] = [];
      
      res.json(models);
    } catch (error) {
      next(error);
    }
  },

  addModel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { name, provider, modelId, apiKey, baseUrl } = req.body;

      // TODO: Implement model addition to database
      const model = {
        id: 'temp-id',
        name,
        provider,
        modelId,
        baseUrl,
        isDefault: false,
        isActive: true,
        userId
      };

      res.status(201).json(model);
    } catch (error) {
      next(error);
    }
  },

  updateModel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const updates = req.body;

      // TODO: Implement model update
      
      res.json({ message: 'Model updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteModel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      // TODO: Implement model deletion
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  testModel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      // TODO: Get model from database and test it
      const model = null;
      
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }

      const isWorking = await aiService.testModel(model);
      
      res.json({ isWorking });
    } catch (error) {
      next(error);
    }
  },

  // Content Generation
  generateContent: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { prompt, modelId, maxTokens, temperature, systemPrompt } = req.body;

      const response = await aiService.generateText({
        prompt,
        modelId,
        maxTokens,
        temperature,
        systemPrompt
      });

      res.json(response);
    } catch (error) {
      logger.error('Content generation error:', error);
      next(error);
    }
  },

  improveWriting: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { text, improvementType } = req.body;

      if (!text || !improvementType) {
        return res.status(400).json({ error: 'Text and improvement type are required' });
      }

      const response = await aiService.improveWriting(text, improvementType);
      
      res.json(response);
    } catch (error) {
      logger.error('Writing improvement error:', error);
      next(error);
    }
  },

  generateSuggestions: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { prompt, context } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const response = await aiService.generateStorySuggestions(prompt, context);
      
      res.json(response);
    } catch (error) {
      logger.error('Suggestion generation error:', error);
      next(error);
    }
  },

  // Story-specific AI features
  generateCharacter: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { characterType, genre } = req.body;

      if (!characterType) {
        return res.status(400).json({ error: 'Character type is required' });
      }

      const response = await aiService.generateCharacterDescription(characterType, genre);
      
      res.json(response);
    } catch (error) {
      logger.error('Character generation error:', error);
      next(error);
    }
  },

  generateWorld: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { genre, setting } = req.body;

      if (!genre) {
        return res.status(400).json({ error: 'Genre is required' });
      }

      const response = await aiService.generateWorldBuilding(genre, setting);
      
      res.json(response);
    } catch (error) {
      logger.error('World generation error:', error);
      next(error);
    }
  },

  generatePlot: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { genre, theme, characters, setting } = req.body;

      const prompt = `Generate a plot outline for a ${genre} story${theme ? ` with the theme of ${theme}` : ''}${characters ? ` featuring ${characters}` : ''}${setting ? ` set in ${setting}` : ''}.`;

      const response = await aiService.generateText({
        prompt,
        systemPrompt: 'You are a plot development expert. Create engaging, well-structured plot outlines with clear conflict, rising action, climax, and resolution.',
        maxTokens: 800,
        temperature: 0.8
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Plot generation error:', error);
      next(error);
    }
  },

  generateDialogue: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { characters, context, tone, length } = req.body;

      if (!characters || characters.length < 2) {
        return res.status(400).json({ error: 'At least two characters are required' });
      }

      const prompt = `Write dialogue between ${characters.join(' and ')}${context ? ` in the context of ${context}` : ''}${tone ? ` with a ${tone} tone` : ''}${length ? ` of approximately ${length} words` : ''}.`;

      const response = await aiService.generateText({
        prompt,
        systemPrompt: 'You are a dialogue expert. Write natural, engaging dialogue that reveals character, advances plot, and feels authentic to each character\'s voice.',
        maxTokens: 500,
        temperature: 0.7
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Dialogue generation error:', error);
      next(error);
    }
  },

  // Text Analysis
  analyzeText: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { text, analysisType } = req.body;

      if (!text || !analysisType) {
        return res.status(400).json({ error: 'Text and analysis type are required' });
      }

      const response = await aiService.analyzeText(text, analysisType);
      
      res.json(response);
    } catch (error) {
      logger.error('Text analysis error:', error);
      next(error);
    }
  },

  summarizeText: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { text, length = 'medium' } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const lengthPrompts = {
        short: 'Provide a brief summary in 1-2 sentences.',
        medium: 'Provide a concise summary in 2-3 sentences.',
        long: 'Provide a detailed summary in 3-5 sentences.'
      };

      const response = await aiService.generateText({
        prompt: `Summarize this text: ${text}`,
        systemPrompt: lengthPrompts[length as keyof typeof lengthPrompts] || lengthPrompts.medium,
        maxTokens: 200,
        temperature: 0.3
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Text summarization error:', error);
      next(error);
    }
  },

  generateOutline: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { text, structure = 'three-act' } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const structurePrompts = {
        'three-act': 'Create a three-act structure outline with setup, confrontation, and resolution.',
        'five-act': 'Create a five-act structure outline following classical dramatic structure.',
        'hero-journey': 'Create a hero\'s journey outline with the classic stages.',
        'chapter': 'Create a chapter-by-chapter outline.'
      };

      const response = await aiService.generateText({
        prompt: `Create an outline for this story concept: ${text}`,
        systemPrompt: structurePrompts[structure as keyof typeof structurePrompts] || structurePrompts['three-act'],
        maxTokens: 600,
        temperature: 0.6
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Outline generation error:', error);
      next(error);
    }
  },

  // Research assistance
  generateResearch: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { topic, genre, depth = 'medium' } = req.body;

      if (!topic) {
        return res.status(400).json({ error: 'Research topic is required' });
      }

      const depthPrompts = {
        basic: 'Provide basic information and key facts.',
        medium: 'Provide detailed information with examples and context.',
        deep: 'Provide comprehensive research with multiple perspectives and sources.'
      };

      const response = await aiService.generateText({
        prompt: `Research information about ${topic}${genre ? ` for a ${genre} story` : ''}.`,
        systemPrompt: `You are a research assistant. ${depthPrompts[depth as keyof typeof depthPrompts] || depthPrompts.medium} Focus on accuracy and relevance to creative writing.`,
        maxTokens: 800,
        temperature: 0.4
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Research generation error:', error);
      next(error);
    }
  },

  factCheck: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { text, context } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const response = await aiService.generateText({
        prompt: `Fact-check this text: ${text}${context ? `\n\nContext: ${context}` : ''}`,
        systemPrompt: 'You are a fact-checking expert. Identify any factual inaccuracies, inconsistencies, or areas that need verification. Be specific about what needs to be checked.',
        maxTokens: 400,
        temperature: 0.2
      });
      
      res.json(response);
    } catch (error) {
      logger.error('Fact-checking error:', error);
      next(error);
    }
  }
};
