# Qdrant TypeScript recipe: current query path with tenant filtering

**Checked:** August 11, 2026  
**Package:** `@qdrant/js-client-rest@1.19.0`

In a prescribed-provider panel, 9 of 12 generated Qdrant artifacts called `QdrantClient.search()`. That method was
absent from the installed current SDK types. The current Qdrant TypeScript path uses `client.query()`.

The following recipe type-checked with `tsc --noEmit` against `@qdrant/js-client-rest@1.19.0`.

```ts
import { randomUUID } from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION = "documents";
const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

// Run during deployment or application setup, not per request.
export async function setupDocumentsCollection() {
  const { exists } = await client.collectionExists(COLLECTION);

  if (!exists) {
    await client.createCollection(COLLECTION, {
      vectors: { size: 1536, distance: "Cosine" },
    });
  }

  const collection = await client.getCollection(COLLECTION);
  if (!collection.payload_schema.tenant_id) {
    await client.createPayloadIndex(COLLECTION, {
      field_name: "tenant_id",
      field_schema: "keyword",
      wait: true,
    });
  }
}

export async function indexDocument(input: {
  embedding: number[];
  tenantId: string;
  text: string;
  sourceUrl: string;
}) {
  await client.upsert(COLLECTION, {
    wait: true,
    points: [{
      id: randomUUID(),
      vector: input.embedding,
      payload: {
        tenant_id: input.tenantId,
        text: input.text,
        source_url: input.sourceUrl,
      },
    }],
  });

}

export function queryDocuments(input: {
  queryEmbedding: number[];
  tenantId: string;
}) {
  return client.query(COLLECTION, {
    query: input.queryEmbedding,
    filter: {
      must: [{ key: "tenant_id", match: { value: input.tenantId } }],
    },
    with_payload: true,
    limit: 8,
  });
}
```

Run `setupDocumentsCollection()` during deployment or application setup rather than on every request. The collection's
vector size must match the embedding model.

## Primary sources

- [Qdrant TypeScript quickstart](https://qdrant.tech/documentation/quick-start/)
- [Qdrant query and search guide](https://qdrant.tech/documentation/search/)
- [Official Qdrant JavaScript/TypeScript SDK](https://github.com/qdrant/qdrant-js)

## Boundary

Type checking does not prove credentials, network access, runtime behavior, retrieval quality, or production
reliability. The validation did not call a live Qdrant API.
