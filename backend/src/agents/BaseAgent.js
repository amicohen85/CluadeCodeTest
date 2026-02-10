import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

/**
 * Base Agent class for AI-powered system analysis
 * Supports Anthropic Claude, OpenAI, and Google Gemini
 * Includes Demo Mode for testing without API keys
 */
export class BaseAgent {
  constructor(config = {}) {
    this.name = config.name || 'BaseAgent';
    this.provider = config.provider || process.env.AI_PROVIDER || this.detectProvider();
    this.model = config.model || this.getDefaultModel();
    this.maxTokens = config.maxTokens || 4096;
    this.temperature = config.temperature || 0.7;

    // Check if any API key is available
    const hasApiKey = process.env.ANTHROPIC_API_KEY ||
                      process.env.OPENAI_API_KEY ||
                      process.env.GEMINI_API_KEY ||
                      process.env.GOOGLE_API_KEY;

    this.demoMode = process.env.DEMO_MODE === 'true' || !hasApiKey;

    if (this.demoMode) {
      logger.info(`[${this.name}] Running in DEMO MODE - no API key configured`);
    } else {
      logger.info(`[${this.name}] Using provider: ${this.provider}`);
      this.initializeClient();
    }
  }

  /**
   * Auto-detect which provider to use based on available API keys
   */
  detectProvider() {
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      return 'gemini';
    }
    if (process.env.ANTHROPIC_API_KEY) {
      return 'anthropic';
    }
    if (process.env.OPENAI_API_KEY) {
      return 'openai';
    }
    return 'anthropic'; // default
  }

  getDefaultModel() {
    switch (this.provider) {
      case 'gemini':
        return 'gemini-1.5-flash';
      case 'anthropic':
        return 'claude-sonnet-4-20250514';
      case 'openai':
        return 'gpt-4-turbo-preview';
      default:
        return 'gemini-1.5-flash';
    }
  }

  initializeClient() {
    switch (this.provider) {
      case 'gemini':
        const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        this.client = new GoogleGenerativeAI(geminiKey);
        this.geminiModel = this.client.getGenerativeModel({ model: this.model });
        break;
      case 'anthropic':
        this.client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        break;
      case 'openai':
        this.client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        break;
    }
  }

  /**
   * Get the system prompt for this agent
   * Override in subclasses
   */
  getSystemPrompt() {
    return 'You are a helpful AI assistant specialized in system analysis.';
  }

  /**
   * Get demo response - Override in subclasses
   */
  getDemoResponse(userMessage, context = {}) {
    return `# Demo Response

This is a demo response from ${this.name}.

**Your Input:** ${userMessage.substring(0, 100)}...

---

> Note: This is demo mode. Connect an API key for real AI-generated content.`;
  }

  /**
   * Process a request through the AI model
   */
  async process(userMessage, context = {}) {
    const startTime = Date.now();
    logger.info(`[${this.name}] Processing request with ${this.provider}...`);

    try {
      let response;

      if (this.demoMode) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        response = this.getDemoResponse(userMessage, context);
      } else {
        const systemPrompt = this.getSystemPrompt(context);

        switch (this.provider) {
          case 'gemini':
            response = await this.processWithGemini(systemPrompt, userMessage);
            break;
          case 'anthropic':
            response = await this.processWithAnthropic(systemPrompt, userMessage);
            break;
          case 'openai':
            response = await this.processWithOpenAI(systemPrompt, userMessage);
            break;
          default:
            throw new Error(`Unknown provider: ${this.provider}`);
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`[${this.name}] Completed in ${duration}ms`);

      return {
        success: true,
        data: response,
        metadata: {
          agent: this.name,
          provider: this.provider,
          model: this.demoMode ? 'demo-mode' : this.model,
          duration,
          demoMode: this.demoMode
        }
      };
    } catch (error) {
      logger.error(`[${this.name}] Error:`, error);
      throw error;
    }
  }

  async processWithGemini(systemPrompt, userMessage) {
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser Request:\n${userMessage}`;

    const result = await this.geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }

  async processWithAnthropic(systemPrompt, userMessage) {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    return response.content[0].text;
  }

  async processWithOpenAI(systemPrompt, userMessage) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    return response.choices[0].message.content;
  }

  /**
   * Parse structured output from AI response
   */
  parseStructuredOutput(text, format = 'json') {
    if (format === 'json') {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch {
          return { raw: text };
        }
      }
      // Try parsing the whole text as JSON
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    }
    return text;
  }
}

export default BaseAgent;
