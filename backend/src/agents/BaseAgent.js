import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

/**
 * Base Agent class for AI-powered system analysis
 * Supports both Anthropic Claude and OpenAI models
 * Includes Demo Mode for testing without API keys
 */
export class BaseAgent {
  constructor(config = {}) {
    this.name = config.name || 'BaseAgent';
    this.provider = config.provider || process.env.AI_PROVIDER || 'anthropic';
    this.model = config.model || this.getDefaultModel();
    this.maxTokens = config.maxTokens || 4096;
    this.temperature = config.temperature || 0.7;
    this.demoMode = process.env.DEMO_MODE === 'true' ||
                    (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY);

    if (this.demoMode) {
      logger.info(`[${this.name}] Running in DEMO MODE - no API key required`);
    } else {
      this.initializeClient();
    }
  }

  getDefaultModel() {
    return this.provider === 'anthropic'
      ? 'claude-sonnet-4-20250514'
      : 'gpt-4-turbo-preview';
  }

  initializeClient() {
    if (this.provider === 'anthropic') {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    } else {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
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
    logger.info(`[${this.name}] Processing request...`);

    try {
      let response;

      if (this.demoMode) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        response = this.getDemoResponse(userMessage, context);
      } else {
        const systemPrompt = this.getSystemPrompt(context);
        if (this.provider === 'anthropic') {
          response = await this.processWithAnthropic(systemPrompt, userMessage);
        } else {
          response = await this.processWithOpenAI(systemPrompt, userMessage);
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`[${this.name}] Completed in ${duration}ms`);

      return {
        success: true,
        data: response,
        metadata: {
          agent: this.name,
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
        return JSON.parse(jsonMatch[1]);
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
