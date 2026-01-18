---
title: "Building an MCP Server for Conversational Cloud Operations"
description: "How I built a Model Context Protocol server to enable natural language interactions with AWS infrastructure, bridging the gap between LLMs and cloud operations."
pubDate: 2025-12-15
tags: ["mcp", "aws", "serverless", "ai", "typescript", "cloud-operations"]
draft: false
---

As cloud infrastructure grows more complex, engineers spend countless hours switching between consoles, mastering CLI syntax, and correlating data across platforms. During my bachelor thesis project, I set out to solve this by building a system that enables conversational cloud operations through natural language interfaces. The core of this solution? A Model Context Protocol (MCP) server that bridges the gap between LLMs and AWS infrastructure.

## The Problem: Context Switching Kills Productivity

Organizations operating in cloud environments face significant operational friction when diagnosing infrastructure issues, analyzing costs, retrieving telemetry data, and debugging applications. Engineers must manually navigate between various cloud service consoles, master complex CLI commands, and correlate data across multiple platforms—resulting in steep learning curves, cognitive overhead, and delayed incident resolution.

The gap between today's manual workflows and ideal conversational cloud management became the core problem I wanted to address.

## Why Model Context Protocol?

MCP is an open-source standard developed by Anthropic for connecting AI applications to external data sources, tools, and workflows. It provides a standardized communication layer, allowing any MCP-compatible client (Claude Desktop, ChatGPT, VSCode, Cursor) to discover and invoke tools exposed by an MCP server with no additional integration work.

The protocol follows a client-server architecture with three core primitives that servers can expose:

1. **Tools** - executable functions the LLM can invoke
2. **Data sources** - provide contextual information
3. **Prompts** - reusable templates for LLM interactions

For my project, the MCP server exposes AWS SDK operations as Tools, each with a JSON Schema input definition. This approach satisfied several key requirements: universal model compatibility, model-agnostic design, separation of concerns, and standardized security.

## Architecture: Serverless by Default

I designed the MCP server as a serverless microservice running on AWS Lambda with API Gateway in front. The invocation flow is straightforward:

1. An MCP client establishes a connection to API Gateway
2. The Initialize request triggers a Lambda that returns tool definitions (name, description, and input schema)
3. For each tool call, the client sends a CallTool request which triggers the Lambda
4. The Lambda validates the incoming request, assumes the IAM role for the given request, executes the API call, and returns structured results
5. All invocations and responses are logged to CloudWatch Logs

Key benefits of this serverless approach include automatic scaling (to zero and beyond), pay-per-request pricing, built-in observability, and API Gateway's built-in authentication, rate limiting, and DDoS protection.

While serverless was the default, I also packaged each Lambda as a Docker image, allowing teams to deploy the same artifact to ECS, EC2, or Kubernetes.

![AI Agent Architecture](/blog/mcp-server-architecture.png)

## Implementation: Building the Tool Layer

The foundation of my MCP server is a generic Tool type that uses Zod schemas for type-safe argument validation. The run function's argument type is automatically inferred from the given schema.

```typescript
// Generic tool definition with Zod schema validation
export interface Tool<TSchema extends z.ZodObject<any>> {
  name: string;
  description: string;
  inputSchema: TSchema;
  run: (args: z.infer<TSchema>) => Promise<ToolResult>;
}
```

Each tool implementation follows a consistent pattern: a name, description, Zod schema for input validation, and an asynchronous run function. Zod schemas with .describe() provide documentation for both developers and LLMs, which use it to understand parameter purpose.

```ts
// Example: CloudWatch Logs tool factory
export const cloudwatchListMetricsTool = createTool({
  name: "aws_cloudwatch_list_metrics",
  description: "List CloudWatch metrics with optional filtering",
  inputSchema: z.object({
    region: z.string().optional().describe("AWS region"),
    namespace: z.string().optional().describe("Metric namespace"),
    metricName: z.string().optional().describe("Metric name"),
  }),
  run: async ({ region, namespace, metricName }) => {
    const cloudwatch = new CloudWatchClient({ region });
    const command = new ListMetricsCommand({
      Namespace: namespace,
      MetricName: metricName,
    });
    const response = await cloudwatch.send(command);
    return { metrics: response.Metrics };
  },
});
```

The API handler implements the MCP protocol by routing requests based on the method:

```ts
// MCP protocol implementation in API route
export async function handler(event: APIGatewayEvent) {
  const { method, params } = JSON.parse(event.body);

  switch (method) {
    case "tools/list":
      return {
        tools: allTools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      };

    case "tools/call":
      const tool = allTools.find((t) => t.name === params.name);
      if (!tool) throw new Error(`Tool ${params.name} not found`);

      const args = tool.inputSchema.parse(params.arguments);
      return await tool.run(args);

    default:
      throw new Error(`Method ${method} not supported`);
  }
}
```

## Testing: Verifying Deterministic Components

Testing AI systems presents unique challenges. While traditional software testing verifies deterministic behavior, AI systems produce non-deterministic outputs. I focused on testing the deterministic components: protocol correctness and tool integration.

MCP protocol tests verify correct JSON-RPC 2.0 implementation and MCP-specific methods, independent of tool implementation:

```ts
// Testing MCP protocol correctness
describe("MCP Protocol", () => {
  test("should list available tools", async () => {
    const response = await handler({
      body: JSON.stringify({ method: "tools/list", params: {} }),
    });

    expect(response.tools).toBeDefined();
    expect(response.tools.length).toBeGreaterThan(0);
  });

  test("should reject invalid method", async () => {
    await expect(
      handler({
        body: JSON.stringify({ method: "invalid", params: {} }),
      }),
    ).rejects.toThrow();
  });
});
```

Tool integration tests verify that AWS SDK operations execute correctly and return properly structured responses, covering positive scenarios, negative scenarios, and validation tests confirming Zod schemas reject invalid inputs:

```ts
// Testing tool integration with real AWS APIs
describe("CloudWatch Tools", () => {
  test("should list metrics successfully", async () => {
    const result = await cloudwatchListMetricsTool.run({
      region: "us-east-1",
      namespace: "AWS/Lambda",
    });

    expect(result.metrics).toBeDefined();
    expect(Array.isArray(result.metrics)).toBe(true);
  });

  test("should reject invalid region", async () => {
    await expect(
      cloudwatchListMetricsTool.run({ region: 123 }),
    ).rejects.toThrow();
  });
});
```

## Real-World Integration

The implementation is fully compliant with the MCP server protocol, enabling integration with any MCP-compatible client without additional code. I successfully tested it with Claude Desktop and Visual Studio Code, where engineers can ask questions like "Why did my Lambda costs spike yesterday?" and receive evidence-based answers grounded in their actual CloudWatch metrics and logs.

## Conclusion

Building this MCP server taught me that the key to successful AI integration isn't just about calling LLMs—it's about creating a robust, standardized layer between models and external systems. The Model Context Protocol provides exactly that, and its adoption by major AI players makes it a pragmatic choice for 2025.

While challenges remain around AI reliability and the ecosystem is rapidly evolving, this architecture provides a solid foundation. The serverless design ensures cost-efficiency and scalability, while the tool-based approach keeps the system maintainable and extensible.

For organizations drowning in cloud complexity, an MCP server might just be the lifeline they need to bring conversational AI into their operational workflows.
