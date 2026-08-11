# Qdrant TypeScript recipe: current query path with tenant filtering

**Checked:** August 11, 2026  
**Package:** `@qdrant/js-client-rest@1.19.0`

In a prescribed-provider panel, 9 of 12 generated Qdrant artifacts called `QdrantClient.search()`. That method was
absent from the installed current SDK types. The current Qdrant TypeScript path uses `client.query()`.

The following recipe type-checked with `tsc --noEmit` against `@qdrant/js-client-rest@1.19.0`.

```ts
import { randomUUID } from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

await client.createCollection("documents", {
  vectors: { size: 1536, distance: "Cosine" },
});

await client.createPayloadIndex("documents", {
  field_name: "tenant_id",
  field_schema: "keyword",
  wait: true,
});

await client.upsert("documents", {
  wait: true,
  points: [{
    id: randomUUID(),
    vector: embedding,
    payload: { tenant_id: tenantId, text, source_url: sourceUrl },
  }],
});

const result = await client.query("documents", {
  query: queryEmbedding,
  filter: {
    must: [{ key: "tenant_id", match: { value: tenantId } }],
  },
  with_payload: true,
  limit: 8,
});
```

Create the collection and payload index during application setup rather than on every request. The collection's vector
size must match the embedding model.

## Primary sources

- [Qdrant TypeScript quickstart](https://qdrant.tech/documentation/quick-start/)
- [Qdrant query and search guide](https://qdrant.tech/documentation/search/)
- [Official Qdrant JavaScript/TypeScript SDK](https://github.com/qdrant/qdrant-js)

## Boundary

Type checking does not prove credentials, network access, runtime behavior, retrieval quality, or production
reliability. The validation did not call a live Qdrant API.
