import { GoogleGenAI, Type } from "@google/genai";
import { CognitionReport } from "../types";
import { SYSTEM_INTEGRATION_PROMPT } from "../knowledge_base";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runCognitionCycle = async (inputs: any): Promise<CognitionReport> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `CONTEXT: ${JSON.stringify(inputs)}`,
    config: {
      systemInstruction: SYSTEM_INTEGRATION_PROMPT + "\nTASK: Generate Cognition Cycle Report in JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          activeAxioms: { type: Type.ARRAY, items: { type: Type.STRING } },
          thoughts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                modality: { type: Type.STRING }
              }
            }
          },
          state: {
            type: Type.OBJECT,
            properties: {
              regime: { type: Type.STRING },
              instabilityProbability: { type: Type.NUMBER },
              liquidityStress: { type: Type.NUMBER }
            }
          },
          visualMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { label: { type: Type.STRING }, value: { type: Type.NUMBER } }
            }
          }
        },
        required: ["summary", "activeAxioms", "thoughts", "state", "visualMetrics"]
      }
    }
  });
  return { timestamp: Date.now(), ...JSON.parse(response.text || "{}") };
};

export const requestFinancialReport = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: {
      systemInstruction: SYSTEM_INTEGRATION_PROMPT + "\nTASK: Detailed professional strategy with 4 visual metrics.",
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }]
    }
  });
  const data = JSON.parse(response.text || "{}");
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((c: any) => c.web).filter((w: any) => w?.uri) || [];
  return { ...data, sources };
};
