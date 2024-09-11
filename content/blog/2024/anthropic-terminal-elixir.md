---
title: Anthropic in the Terminal with Elixir
description: A simple example of using Anthropic in the terminal with Elixir.
og:
  title: Anthropic in the Terminal with Elixir
  description: A simple example of using Anthropic in the terminal with Elixir.
path: /blog/2024/anthropic-terminal-elixir
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/ts-claude/claude-terminal.png
  alt: og-image
publishedOn: '2024-09-09'
tags:
  - Elixir
  - Anthropic
  - Claude
  - Terminal
  - Tmux
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/ts-claude/claude-terminal.png" alt="Claude in the Terminal" class="featured-image">

## Intro

If you've been around the internet lately, you've probably seen a bunch of people talking about [Anthropic's Claude](https://www.anthropic.com). Either as a consumer or a developer, it's hard to ignore the hype.

So what is Claude?

Claude is an AI assistant developed by Anthropic, a company that specializes in conversational AI. It's designed to understand and generate human-like text, making it a powerful tool for tasks like content creation, coding, and more.

As an engineer, you may have already started utilizing Claude via [Cursor](https://www.cursor.com) or the Claude API, but what about the terminal?

## Because We Can

Some of us still prefer the terminal. (NeoVim... btw)
It has some deep rooted nostalgia that can't quite be replicated in a GUI.

The issue is that most of the AI bots around are Web Based apps, or in the case of Cursor an entirely new IDE altogether!

While Cursor is *REALLY nice... Sometimes I simply want to stay in my flow state inside of tmux.

Like any true Linux, Terminal, Vim loving nerd... I can just build my own gosh darn Claude in the terminal!

## Overview

This could be in most any language, but I chose Elixir here as it is a language I've used for almost a decade now... I'm comfortable with it, and I enjoy it. Elixir also has some really nice IO capabilities that make it easy to stream data to the console.

Brew your own CLI however you see fit.(Rust, Python, Node, etc)

The point here is that you CAN build something that streams responses from Claude into your terminal the same as you would with their web app.

Grab yourself an API key and crack open their [docs](https://docs.anthropic.com/en/api/messages).

## Showcase

In my example below I'm able to simply run the program using `iex -S mix` or compiling and running the script `elixir claude.ex` and be dropped into a REPL where I can chat with Claude.

![Claude in the Terminal](https://ik.imagekit.io/mthomps4/site/posts/ts-claude/iex-claude.png)

## The Code

Below is a simple IO / REST example of how to interact with Claude via their API.
This example doesn't cover everything (streaming, error handling, etc) but it's a good starting point.

```elixir
defmodule Claude do
  @moduledoc """
    Chat with Claude CLI
  """

  import IO.ANSI

  @api_url "https://api.anthropic.com/v1/messages"

  def start do
    IO.puts(green() <> "Chatbot initialized. Type 'exit' to end the conversation.")
    chat_loop()
  end

  defp chat_loop do
    input = IO.gets(cyan() <> "You: " <> reset()) |> String.trim()

    if input == "exit" do
      IO.puts(yellow() <> "Chatbot: " <> reset() <> "Goodbye!")
    else
      case request_completion(input) do
        {:ok, response} ->
          IO.puts(yellow() <> "Claude: " <> reset() <> "#{response}")

        {:error, response} ->
          IO.puts(red() <> "Error: #{inspect(response)}")
      end

      chat_loop()
    end
  end

  defp api_key do
    Application.get_env(:anthropic, :api_key) || raise("Anthropic API key is not set")
  end

  defp request_completion(input) do
    headers = [
      {"Content-Type", "application/json"},
      {"x-api-key", api_key()},
      {"anthropic-version", "2023-06-01"}
    ]

    body =
      Jason.encode!(%{
        "model" => "claude-3-5-sonnet-20240620",
        "max_tokens" => 1024,
        "messages" => [
          %{"role" => "user", "content" => input}
        ]
      })

    case HTTPoison.post(@api_url, body, headers, recv_timeout: 120_000) do
      {:ok, %{status_code: 200, body: response_body}} ->
        {:ok, extract_response(response_body)}

      {:ok, %{status_code: status_code, body: response_body}} ->
        {:error, "#{status_code} #{extract_error(response_body)}"}

      {:error, %{status_code: status_code, body: response_body}} ->
        {:error, "#{status_code} #{extract_error(response_body)}"}

      {:error, reason} ->
        {:error, inspect(reason)}

      _ ->
        {:error, %{reason: "Unknown error"}}
    end
  end

  defp extract_error(body) do
    body
    |> Jason.decode!()
    |> Map.get("error")
    |> Map.get("message")
  end

  defp extract_response(body) do
    body
    |> Jason.decode!()
    |> Map.get("content")
    |> List.first()
    |> Map.get("text")
  end
end
```

## Conclusion

Is it overkill? No way!
We are engineers after all, and it's fun to build things!

Get inspired! Take a look at the [cookbook](https://github.com/anthropics/anthropic-cookbook) for more examples of what you can do with Claude.
