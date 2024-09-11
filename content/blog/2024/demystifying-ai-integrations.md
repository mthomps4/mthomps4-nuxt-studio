---
title: "Demystifying AI Integrations"
description: "Learn how to integrate AI into your web apps with ease using Anthropic's Claude and more."
og:
  title: "Demystifying AI Integrations"
  description: "Learn how to integrate AI into your web apps with ease using Anthropic's Claude and more."
image:
  src: "https://ik.imagekit.io/mthomps4/site/posts/ts-claude/Claude-chats.png"
  alt: "Claude Logo"
path: /blog/2024/demystifying-ai-integrations
tags:
  - AI
  - ML
  - LLM
  - claude
  - anthropic
  - Typescript
publishedOn: '2024-09-10'
organization:
  name: Echobind
  site: https://echoind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/ts-claude/Claude-chats.png" alt="Claude Logo" class="featured-image">

## Intro

ChatGPT, Claude, Copilot, Bedrock, Gemini, and more.
In the ever-evolving landscape of web development, integrating AI capabilities might seem like a daunting task. But fear not! It's more accessible than you might think.

Let's break down the process and explore how you can add AI power to your web applications.

## The Building Blocks

AI integration in web apps is no different than consuming any other 3rd party service. At it's core, it consists of making an API call and reflecting data back to the end user. Breaking it down, we have a few key components:

- The Service: LLM (Large Language Model) to interface with. (Claude-sonnet, GPT-4o, etc)
- An API/SDK to communicate with the LLM. (Anthropic API, OpenAI API, etc)
- A UI layer to allow users to interact with our API.
- Prompt Engineer -- YOU the person asking your deepest darkest poster syndrome induced questions.

From here the rest is simply data/state management in the UI. e.g. How do we take the response from our LLM and display it to the user.

## Hello World

How you choose to interact with Claude is up to you.
For most folks, this will be a web app.

In this example we will use Anthropic's API for Claude to answer a simple question and display the response to the user. As a bonus, we'll leverage some syntax highlighting to make the code snippets (artifiacts) claude returns more human readable.

However, if you are an engineer spending your day in the terminal -- you may find a quick terminal application works just as well. [Elixir CLI Example](https://mthomps4.com/blog/2024/anthropic-terminal-elixir/)

For both of these examples, we still leverage the same [Anthropic API](https://docs.anthropic.com/en/api/messages)!

## Getting Started: A Bare-Bones Approach

Let's start with a simple example using the Anthropic AI Typescript SDK:

```ts
import Anthropic from '@anthropic-ai/sdk';

const getChatResponse = async (prompt: string) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-opus", // claude-3-sonnet, claude-3-haiku, etc.
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    console.log({ response })

    return response;
  } catch (error) {
    console.error({ error })
  }
}
```

This snippet sets up the client and returns a response from Claude based off the given `prompt`. Simple, right?

## Integrating with a UI (NextJS example)

Now that we understand the basic API interaction, let's integrate it into a user interface. We'll use Next.js to create a simple form that allows users to interact with Claude.

Here's how we can structure a basic React component:

1. We'll create a form with a text input for the user's question and a submit button.
2. We'll use React's useState hook to manage the input and response states.
3. When the form is submitted, we'll call our `action` function and update the UI with Claude's response.

This example is an over simplification of a chat application for the sake of clarity and doesn't represent a full production application. However, it demonstrates the core concepts.

Below you'll find the code for our example.

One thing to note, all of claude's content is returned as markdown. As a bonus, we've added `react-markdown` and `react-syntax-highlighter` to make the response more human readable!

If you've ever wondered how chatgpt, claude, or any of the other LLMs display code snippets, this is a good example. It's just Markdown!

Following the example below you can note at a high level a User can interact with our form updating the `input` state that is then sent to our `action` function in our submit handler.

This `action` function is where we make our API call to claude and handle the response.

Each time we call our `streamMessage` function, we pass in our `input` state and await the response.

We then take that response and update our `chatHistory` state which is a list of all the messages in the chat.As chatHistory updates, the dom is updated for the user to see the response.

![Claude Chat](https://ik.imagekit.io/mthomps4/site/posts/ts-claude/highlighted.png)

## Ways to improve

Again, this is a very simple example, but it demonstrates the core concepts. From here you can start to think about how you might want to structure your application.

Some ideas:

- Streaming Responses: For a more dynamic user experience.
- Error Handling: Gracefully manage API failures or rate limiting.
- Context Management: Maintain conversation history for more coherent interactions.
- Saving the Conversation: Implement a feature to save and retrieve conversations for future reference.

If you are in the React ecosystem, you may find Vercel's `ai` sdk [npm](https://www.npmjs.com/package/ai) to be a good fit for your needs. It provides a higher level abstraction for interacting with AI services and integrates nicely with Next.js actions!

Read more [here](https://sdk.vercel.ai/docs/ai-sdk-core/overview)

## AI is not just for Big Tech

Remember, AI integration isn't limited to tech giants. Small projects and individual developers can leverage these tools too. Whether you're building a personal blog, a productivity app, or a business tool, there's likely an AI use case that can enhance your project.

## The Flexibility of AI

While we've used Anthropic's Claude as an example, the principles apply to various AI services. Whether you're using OpenAI, Hugging Face, or even your own custom model, the integration process follows a similar pattern.

## Wrapping Up

Integrating AI into your web applications doesn't have to be intimidating. Start small, experiment, and gradually expand your AI features. With the right approach, you'll be surprised at how quickly you can add powerful AI capabilities to your projects.
Remember, the key is to start simple and build from there. Happy coding!

## The Code

A POC repo can be found [here](https://github.com/mthomps4/ts-claude).

[page.tsx] The entry point of our applicaiton

```ts
import ClaudeChat from "./ClaudeChat";

export default async function Home() {
  return (
    <div className="min-h-screen w-full">
      <main className="bg-slate-200 rounded-lg m-4 p-10">
        <h1 className="font-bold text-4xl">TS Claude</h1>
        <ClaudeChat />
      </main>
    </div>
  );
}
```

[ClaudeChat.tsx] The chat component that allows the user to input a message and submit it to Claude.

```ts
"use client";

import { useState } from "react";
import { streamMessage } from "./actions";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const ClaudeChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = `You: ${input}`;
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await streamMessage(input);
      setChatHistory((prev) => [...prev, `Claude: ${response}`]);
    } catch (error: unknown) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        `Error: ${(error as Error)?.message ?? "Unable to get response"}`,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-grow overflow-auto p-4">
        {chatHistory.map((message, index) => (
          <div key={index} className="mb-2">
            {message.startsWith("You: ") ? (
              <>
                <h3 className="font-bold text-lg">You:</h3>
                <p>{message.replace("You: ", "")}</p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg">Claude:</h3>
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          // @ts-expect-error what is this?
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.replace("Claude: ", "")}
                </ReactMarkdown>
              </>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-2 p-2 rounded"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ClaudeChat;

```

[action.ts] The action that is called when the user submits a message. It streams the response from Claude and updates the UI with the response.

```ts
"use server";

import { Anthropic } from "@anthropic-ai/sdk";

export async function streamMessage(msg: string) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("Anthropic API key not found");
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    if (!msg) {
      throw new Error("Message is required");
    }

    const stream = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: msg }],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        fullResponse += chunk.delta.text;
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error processing your request");
  }
}

```
