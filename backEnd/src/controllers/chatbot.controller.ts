import { Request, Response } from "express";
import OpenAI from "openai";
import { config } from "../config/env.js";
import { UCalgaryService } from "../services/ucalgary.service.js";
import { AHSService } from "../services/ahs.service.js";
import { StudentUnionService } from "../services/studentUnion.service.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });
const ucalgaryService = new UCalgaryService();
const ahsService = new AHSService();
const suService = new StudentUnionService();

const SYSTEM_PROMPT = `You are a compassionate healthcare assistant for University of Calgary students. 

Your role:
1. Provide accurate, evidence-based health information
2. Direct students to appropriate resources (UCalgary Wellness, AHS, Student Union)
3. Be empathetic and supportive
4. NEVER diagnose or replace professional medical advice

Key Resources:
- UCalgary Wellness Centre: 403-210-9355 (free counselling, medical clinic)
- Health Link 811: 24/7 nurse advice line
- Mental Health Help Line: 1-877-303-2642 (24/7 crisis support)
- StudentCare Plan: Covers up to $1,500/year for mental health
- SU Food Bank: Free groceries, no questions asked
- Emergency: 911 or Campus Security 403-220-5333

Intent Detection:
- Mental health concerns → Wellness Centre counselling + StudentCare coverage
- Can't afford therapy → SU StudentCare plan + Wellness Centre free sessions
- Physical health → Student Medical Clinic or Health Link 811
- Crisis/emergency → 911, Mental Health Help Line, Distress Centre
- Food insecurity → SU Food Bank
- STI testing → Student Medical Clinic or Calgary Sexual Health Centre

Always be warm, non-judgmental, and provide specific next steps.`;

export class ChatbotController {
  async chat(req: Request, res: Response) {
    try {
      const { message, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Detect intent and fetch relevant resources
      const intent = this.detectIntent(message);
      const resources = await this.fetchRelevantResources(intent);

      // Build context with resources
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
      ];

      // Add resource context if available
      if (resources) {
        messages.push({
          role: "system",
          content: `Current Resources Available:\n${JSON.stringify(resources, null, 2)}`,
        });
      }

      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages.push(...conversationHistory);
      }

      messages.push({
        role: "user",
        content: message,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const reply = completion.choices[0].message.content;

      res.json({
        reply,
        intent,
        resources,
        conversationHistory: [
          ...messages.slice(2).filter((m) => m.role !== "system"),
          {
            role: "assistant",
            content: reply,
          },
        ],
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase();

    if (
      lower.includes("anxious") ||
      lower.includes("depressed") ||
      lower.includes("overwhelmed") ||
      lower.includes("mental health") ||
      lower.includes("counselling") ||
      lower.includes("therapy")
    ) {
      return "mental_health";
    }

    if (
      lower.includes("can't afford") ||
      lower.includes("too expensive") ||
      lower.includes("no money") ||
      lower.includes("insurance")
    ) {
      return "financial_support";
    }

    if (
      lower.includes("sti") ||
      lower.includes("std") ||
      lower.includes("testing") ||
      lower.includes("birth control") ||
      lower.includes("sexual health")
    ) {
      return "sexual_health";
    }

    if (
      lower.includes("food") ||
      lower.includes("hungry") ||
      lower.includes("groceries") ||
      lower.includes("meal")
    ) {
      return "food_security";
    }

    if (
      lower.includes("emergency") ||
      lower.includes("crisis") ||
      lower.includes("suicidal") ||
      lower.includes("hurt myself")
    ) {
      return "crisis";
    }

    if (
      lower.includes("fever") ||
      lower.includes("cold") ||
      lower.includes("flu") ||
      lower.includes("sick")
    ) {
      return "physical_health";
    }

    return "general";
  }

  private async fetchRelevantResources(intent: string) {
    switch (intent) {
      case "mental_health":
        const wellness = await ucalgaryService.getWellnessResources();
        const ahs = await ahsService.getResources();
        const su = suService.getResources();
        return {
          ucalgary: wellness.mentalHealth,
          ahs: ahs.mentalHealthHelpLine,
          distressCentre: ahs.distressCentre,
          insurance: su.insurance,
        };

      case "financial_support":
        return {
          studentCare: suService.getResources().insurance,
          freeServices: (await ucalgaryService.getWellnessResources()).mentalHealth,
        };

      case "sexual_health":
        return {
          medicalClinic: (await ucalgaryService.getWellnessResources()).medicalClinic,
          clinics: await ahsService.searchClinics("Calgary"),
        };

      case "food_security":
        return {
          foodBank: suService.getResources().foodSecurity,
        };

      case "crisis":
        const ahsResources = await ahsService.getResources();
        return {
          emergency: "911",
          mentalHealthHelpLine: ahsResources.mentalHealthHelpLine,
          distressCentre: ahsResources.distressCentre,
          campusSecurity: "403-220-5333",
        };

      case "physical_health":
        return {
          medicalClinic: (await ucalgaryService.getWellnessResources()).medicalClinic,
          healthLink: (await ahsService.getResources()).healthLink,
        };

      default:
        return null;
    }
  }
}