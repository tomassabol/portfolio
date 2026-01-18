---
title: "Building an AI Agent for Autonomous Cloud Operations"
description: "How I built an event-driven AI agent using AWS Step Functions, Lambda, and LLMs to transform reactive cloud alarms into proactive incident analysis."
pubDate: 2025-12-15
tags: ["ai", "aws", "cloud-operations", "llm", "step-functions", "mcp"]
draft: false
---

While building my bachelor thesis project on conversational cloud operations, I realized that having an MCP server for manual queries was only half the story. The real game-changer would be an autonomous agent that could investigate incidents while I slept. Here's how I built an event-driven AI agent that transforms CloudWatch alarms into actionable insights.

## The Problem: Reactive Operations Don't Scale

Cloud operations today are fundamentally reactive. An alarm fires, a pager goes off, and an engineer stumbles out of bed to manually investigate. The MCP server I built helps, but it still requires a human in the loop. The gap was clear: we needed something that could investigate incidents autonomously, using the same tools engineers would use, but without the 3 AM wake-up call.

## Architecture: Event-Driven from the Ground Up

I designed the AI agent as an event-driven workflow built on AWS Step Functions and Lambda. It's triggered by CloudWatch Alarm state changes via EventBridge and operates without human intervention, transforming reactive alarms into root-cause analysis by leveraging the existing MCP tools.

The workflow looks like this:

1. **Trigger**: A CloudWatch Alarm (e.g., Lambda errors exceeding threshold) sends an event to EventBridge
2. **Orchestration**: Step Functions receives the alarm details and invokes the agent Lambda
3. **Analysis**: The Lambda runs a tool loop with Claude Sonnet 4.5, using AI SDK to call MCP tools
4. **Summary**: JSONata extracts the final summary from the Lambda output
5. **Notification**: The workflow can be extended with SNS for Slack/email notifications

Here's the core architecture:

```typescript
// Lambda handler constructs dynamic context from the alarm event
const systemPrompt = `
You are an autonomous cloud operations agent.
Investigate this CloudWatch Alarm:
- Alarm Name: ${event.alarmName}
- Metric: ${event.metricName}
- Threshold: ${event.threshold}
- Current Value: ${event.currentValue}
- Time: ${event.timestamp}

Use the available tools to:
1. Retrieve relevant logs from CloudWatch
2. Check related metrics
3. Identify the root cause
4. Provide a concise summary with evidence
`;
```

![AI Agent Architecture](/blog/ai-agent-architecture.png)

## Dynamic System Prompts: Context is Everything

The agent's effectiveness depends heavily on the quality of its system prompt. Rather than using a static prompt, the Lambda handler creates a context-aware prompt from the received event, including all relevant alarm details. This ensures the agent understands exactly what it's investigating.

## The Agentic Loop: Autonomous Reasoning

The core of the agent is AI SDK's ToolLoopAgent, which implements an autonomous reasoning loop. The agent receives the system instructions, decides which tools to call based on current context, invokes them, and captures their outputs. The loop ends when the LLM produces a final text response.

```typescript
// Implementation of the Agent using AI SDK
const result = await toolLoopAgent({
  model: bedrock("anthropic.claude-sonnet-4-5-v2"),
  tools: mcpTools, // Reusing the same MCP tools from the server
  system: systemPrompt,
  messages: [],
  onStepFinish: (step) => {
    // Log each reasoning step for audit trail
    console.log(
      `Tool used: ${step.toolCalls.map((t) => t.toolName).join(", ")}`,
    );
  },
});
```

The `onStepFinish` callback logs each reasoning step, including which tools were used. This creates an audit trail showing exactly how the agent reaches its conclusion - critical for trust in autonomous systems.

## Key Benefits: Why This Architecture Works

**Serverless Simplicity**: Runs on Lambda with Step Functions, so it scales to zero when idle and handles spikes automatically.

**Tool Reuse**: Leverages the exact same MCP tools as the manual interface - no code duplication.

**Observability**: Every action is logged to CloudWatch, creating a complete audit trail.

**Extensibility**: The workflow can be easily extended with SNS notifications, PR creation, or escalation to human engineers.

## Real-World Tradeoffs and Challenges

Building this wasn't without challenges. From my risk analysis, several threats materialized:

- **LLM Reliability**: The agent sometimes generates invalid tool calls or misleading output. I mitigated this with strict tool schemas and proper descriptions.
- **Cold Starts**: Initial invocation latency can be high. I used provisioned concurrency for the Lambda to keep response times acceptable.
- **API Rate Limiting**: High tool call volume could hit AWS API limits. I implemented request caching and set conservative rate limits.
- **Cost Management**: LLM costs can spiral. I added usage quotas and support for cheaper models as fallbacks.

## What I Learned

The biggest lesson? The line between "tool" and "agent" is fuzzy but important. The MCP server is a tool - powerful, but passive. The agent is autonomous - it decides what to investigate and when. This autonomy requires much stronger guardrails: audit logs, rate limiting, and human oversight for critical actions.

I also learned that building on existing standards (MCP) and infrastructure (Step Functions) dramatically accelerates development. I could focus on the agent logic instead of reinventing orchestration or tool calling.

## Future Extensions

The canvas approach opens opportunities for future features:

- **Incident Timelines**: Visualize the agent's investigation path on the canvas
- **Compliance Reports**: Automatically generate audit reports from agent runs
- **Collaborative Sessions**: Human engineers can join ongoing agent investigations
- **Multi-Agent Workflows**: One agent investigates, another attempts to create a fix PR

## Conclusion

While challenges remain around AI reliability and the ecosystem is rapidly evolving, this architecture provides a solid foundation for autonomous cloud operations. The agent successfully demonstrates that we can move from reactive to proactive operations, investigating incidents without human intervention while maintaining the trust and observability engineers demand.

For a solo bachelor project, delivering three components - MCP server, canvas application, and AI agent - in just 10 weeks seemed ambitious. But by selecting the right tools (TypeScript, AWS CDK, AI SDK, React Flow) and focusing on an event-driven architecture, it became achievable. The future of cloud operations isn't just conversational - it's autonomous.
