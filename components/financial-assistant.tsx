"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bot,
  Building2,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { Company } from "@/data/companies";
import { createDemoAssistantResponse } from "@/lib/demo-responses";
import {
  assistantTickerStorageKey,
  readStoredTicker,
  writeStoredTicker,
} from "@/lib/demo-storage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: "demo" | "live";
}

interface FinancialAssistantProps {
  companies: Company[];
}

interface AssistantChatProps extends FinancialAssistantProps {
  selectedCompany?: Company;
}

const suggestedQuestions = [
  "What does this company do?",
  "Explain its financial performance.",
  "What are its major financial risks?",
  "How profitable is this company?",
  "Explain its revenue growth.",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function FinancialAssistant({
  companies,
}: FinancialAssistantProps) {
  const searchParams = useSearchParams();
  const urlTicker = searchParams.get("company")?.toUpperCase() ?? "";
  const selectedFromUrl = companies.find(
    (company) => company.ticker === urlTicker,
  );

  return (
    <AssistantChat
      key={selectedFromUrl?.ticker ?? "no-company"}
      companies={companies}
      selectedCompany={selectedFromUrl}
    />
  );
}

function AssistantChat({ companies, selectedCompany }: AssistantChatProps) {
  const router = useRouter();
  const ticker = selectedCompany?.ticker ?? "";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const [preferenceReady, setPreferenceReady] = useState(false);
  const messageCounter = useRef(0);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preferenceReady) return;

    const timeout = window.setTimeout(() => {
      try {
        if (!ticker) {
          const savedTicker = readStoredTicker(
            assistantTickerStorageKey,
            companies.map((company) => company.ticker),
          );
          if (savedTicker) {
            router.replace(
              `/assistant?company=${encodeURIComponent(savedTicker)}`,
              { scroll: false },
            );
            return;
          }
        } else {
          writeStoredTicker(assistantTickerStorageKey, ticker);
        }
        setStorageMessage("");
      } catch {
        setStorageMessage(
          "Browser storage is unavailable; your company preference will not persist.",
        );
      }
      setPreferenceReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [companies, preferenceReady, router, ticker]);

  useEffect(() => {
    const history = historyRef.current;
    if (history) {
      history.scrollTo({ top: history.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  function createMessage(
    role: ChatMessage["role"],
    content: string,
    mode?: ChatMessage["mode"],
  ) {
    messageCounter.current += 1;
    return {
      id: String(messageCounter.current),
      role,
      content,
      ...(mode && { mode }),
    };
  }

  function selectCompany(nextTicker: string) {
    try {
      writeStoredTicker(assistantTickerStorageKey, nextTicker);
      setStorageMessage("");
    } catch {
      setStorageMessage(
        "Browser storage is unavailable; your company preference will not persist.",
      );
    }
    router.replace(
      nextTicker
        ? `/assistant?company=${encodeURIComponent(nextTicker)}`
        : "/assistant",
      { scroll: false },
    );
  }

  async function sendMessage(rawContent: string) {
    const content = rawContent.trim();
    if (!content || !ticker || !selectedCompany || isLoading) return;
    const company = selectedCompany;

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          messages: nextMessages.slice(-12).map(({ role, content: text }) => ({
            role,
            content: text,
          })),
        }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        if (
          response.status === 404 ||
          response.status === 502 ||
          response.status === 503 ||
          response.status >= 500
        ) {
          setMessages((currentMessages) => [
            ...currentMessages,
            createMessage(
              "assistant",
              createDemoAssistantResponse(company, content),
              "demo",
            ),
          ]);
          return;
        }
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "The assistant could not complete your request. Please try again.";
        throw new Error(message);
      }

      if (
        !isRecord(result) ||
        typeof result.answer !== "string" ||
        !result.answer.trim()
      ) {
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage(
            "assistant",
            createDemoAssistantResponse(company, content),
            "demo",
          ),
        ]);
        return;
      }

      const assistantMessage = createMessage(
        "assistant",
        result.answer,
        "live",
      );
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage(
            "assistant",
            createDemoAssistantResponse(company, content),
            "demo",
          ),
        ]);
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The assistant could not complete your request. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[#E9E5EF] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-[#6541C1]">
            <Bot aria-hidden="true" size={18} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#302C39]">
              Financial assistant
            </h2>
            <p className="mt-0.5 text-xs text-[#777281]">
              {selectedCompany
                ? `Context: ${selectedCompany.name} (${selectedCompany.ticker})`
                : "Select a company to begin"}
            </p>
            <p className="mt-1 text-[10px] text-[#96919F]">
              Live AI when configured; otherwise answers use a labeled local
              demo.
            </p>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-[10px] font-semibold text-[#777281] sm:items-end">
          <Building2
            aria-hidden="true"
            className="sr-only"
            size={15}
          />
          <span>Company context</span>
          <select
            value={ticker}
            onChange={(event) => selectCompany(event.target.value)}
            disabled={!preferenceReady || isLoading}
            className="field-control min-w-56 disabled:cursor-wait disabled:opacity-60"
          >
            <option value="">Choose a company</option>
            {companies.map((company) => (
              <option key={company.ticker} value={company.ticker}>
                {company.name} ({company.ticker})
              </option>
            ))}
          </select>
        </label>
      </div>
      {storageMessage && (
        <p role="status" className="border-b border-[#E9E5EF] bg-[#FFFBF2] px-4 py-2 text-xs text-[#996B29] sm:px-5">
          {storageMessage}
        </p>
      )}

      <div
        ref={historyRef}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="h-[min(60vh,38rem)] min-h-[22rem] space-y-5 overflow-y-auto bg-[#FDFCFD] p-4 sm:p-6"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto max-w-xl text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[5px] border border-[#E9E5EF] bg-white text-[#6541C1]">
                <MessageCircle aria-hidden="true" size={19} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#302C39]">
                {selectedCompany
                  ? `Explore ${selectedCompany.name}`
                  : "Start with a company"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#777281]">
                {selectedCompany
                  ? "Ask a question below or choose a suggestion. You can ask follow-ups without repeating the company name."
                  : "Choose a company above to load its profile and illustrative financial context into the conversation."}
              </p>
            </div>
            <div className="mx-auto mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={!selectedCompany || isLoading}
                  onClick={() => void sendMessage(question)}
                  className="border border-[#E9E5EF] bg-white px-3.5 py-3 text-left text-xs leading-5 text-[#514D59] transition hover:border-[#CFC3E5] hover:bg-[#FBF9FE] focus-visible:outline-2 focus-visible:outline-[#6541C1] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <article
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-[#6541C1]">
                  <Sparkles aria-hidden="true" size={16} />
                </span>
              )}
              <div
                className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-[#EEE9F8] text-[#45258B]"
                    : "border border-[#E9E5EF] bg-white text-[#514D59]"
                }`}
              >
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold opacity-70">
                  {message.role === "user" ? (
                    <>
                      <UserRound aria-hidden="true" size={13} />
                      You
                    </>
                  ) : (
                    <>
                      <Sparkles aria-hidden="true" size={13} />
                      {message.mode === "demo"
                        ? "InvestIQ demo response"
                        : "InvestIQ AI"}
                    </>
                  )}
                </p>
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-[#F0EDF4] text-[#777281]">
                  <UserRound aria-hidden="true" size={16} />
                </span>
              )}
            </article>
          ))
        )}

        {isLoading && (
          <div
            role="status"
            className="flex items-center gap-3 text-sm text-[#777281]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#EEE9F8] text-[#6541C1]">
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={17}
              />
            </span>
            InvestIQ is thinking…
          </div>
        )}
      </div>

      <div className="border-t border-[#E9E5EF] bg-white p-4 sm:p-5">
        {error && (
          <p
            role="alert"
            className="mb-3 border border-[#EBCFCF] bg-[#FFF9F8] px-4 py-3 text-sm text-[#A44747]"
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="assistant-message" className="sr-only">
            Ask a financial question
          </label>
          <div className="flex items-end gap-3 border border-[#E9E5EF] bg-white p-2 transition focus-within:border-[#6541C1] focus-within:shadow-[0_0_0_3px_rgba(101,65,193,0.08)]">
            <textarea
              id="assistant-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={2000}
              rows={2}
              disabled={!selectedCompany || isLoading}
              placeholder={
                selectedCompany
                  ? `Ask about ${selectedCompany.name}...`
                  : "Choose a company to ask a question..."
              }
              className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-6 text-[#302C39] outline-none placeholder:text-[#96919F] disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!selectedCompany || !draft.trim() || isLoading}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#6541C1] text-white transition hover:bg-[#45258B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6541C1] disabled:cursor-not-allowed disabled:bg-[#E9E5EF] disabled:text-[#96919F]"
            >
              {isLoading ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={18}
                />
              ) : (
                <Send aria-hidden="true" size={17} />
              )}
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-[10px] leading-5 text-[#96919F] sm:flex-row sm:items-center sm:justify-between">
            <span>Enter to send · Shift + Enter for a new line</span>
            <span>Educational information only, not investment advice.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
