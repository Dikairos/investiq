export interface OpenAIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OpenAIJsonSchema {
  name: string;
  schema: Record<string, unknown>;
}

type OpenAIResult =
  | { ok: true; answer: string }
  | { ok: false; status: 502 | 503; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getResponseText(response: unknown) {
  if (!isRecord(response) || !Array.isArray(response.output)) return "";

  const textParts: string[] = [];
  for (const item of response.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;

    for (const content of item.content) {
      if (
        isRecord(content) &&
        content.type === "output_text" &&
        typeof content.text === "string"
      ) {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

export async function generateOpenAIText({
  systemPrompt,
  messages,
  maxOutputTokens,
  jsonSchema,
}: {
  systemPrompt: string;
  messages: OpenAIMessage[];
  maxOutputTokens: number;
  jsonSchema?: OpenAIJsonSchema;
}): Promise<OpenAIResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "The AI service is not configured. Add OPENAI_API_KEY to the server environment and restart the app.",
    };
  }

  let providerResponse: Response;
  try {
    providerResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_output_tokens: maxOutputTokens,
        ...(jsonSchema && {
          text: {
            format: {
              type: "json_schema",
              name: jsonSchema.name,
              strict: true,
              schema: jsonSchema.schema,
            },
          },
        }),
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      error: "The AI service could not be reached. Please try again.",
    };
  }

  if (!providerResponse.ok) {
    console.error(
      `OpenAI request failed with status ${providerResponse.status}.`,
    );
    return {
      ok: false,
      status: 502,
      error: "The AI service could not complete your request. Please try again.",
    };
  }

  let providerData: unknown;
  try {
    providerData = await providerResponse.json();
  } catch {
    return {
      ok: false,
      status: 502,
      error: "The AI service returned an unreadable response. Please try again.",
    };
  }

  const answer = getResponseText(providerData);
  if (!answer) {
    return {
      ok: false,
      status: 502,
      error: "The AI service returned an empty response. Please try again.",
    };
  }

  return { ok: true, answer };
}
