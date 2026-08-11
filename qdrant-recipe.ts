import { randomUUID } from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";

export async function indexAndQuery(input: {
  embedding: number[];
  queryEmbedding: number[];
  tenantId: string;
  text: string;
  sourceUrl: string;
}) {
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
      vector: input.embedding,
      payload: {
        tenant_id: input.tenantId,
        text: input.text,
        source_url: input.sourceUrl,
      },
    }],
  });

  return client.query("documents", {
    query: input.queryEmbedding,
    filter: {
      must: [{ key: "tenant_id", match: { value: input.tenantId } }],
    },
    with_payload: true,
    limit: 8,
  });
}
