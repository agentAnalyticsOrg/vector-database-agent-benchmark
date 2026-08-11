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
