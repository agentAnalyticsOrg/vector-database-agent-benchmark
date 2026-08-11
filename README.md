# Vector database task evidence for TypeScript RAG

This repository preserves task-level Claude Code selection and current TypeScript SDK compatibility evidence for
Qdrant, Pinecone, and Weaviate. It does not declare a universal vector-database winner.

**Study date:** August 11, 2026  
**Canonical report:** https://agentanalytics.org/research/vector-database-typescript-task-evidence  
**Machine-readable evidence:** [evidence.json](./evidence.json)

## Selection changed by task

Claude Code was required to use current public web search before choosing a provider. Each task had eight accepted
attempts and no provider candidate list was supplied.

| Task | Qdrant | Pinecone | Weaviate |
| --- | ---: | ---: | ---: |
| Production RAG | 1/8 | 7/8 | 0/8 |
| Hybrid filtered search | 8/8 | 0/8 | 0/8 |
| Tenant-safe memory | 3/8 | 3/8 | 2/8 |
| Ingestion worker | 7/8 | 1/8 | 0/8 |

Overall: Qdrant 19/32, Pinecone 11/32, and Weaviate 2/32. This is observed model behavior for one dated panel, not an
objective product-quality ranking.

Claude made 36 search calls and no page fetches in this baseline. The exact model-facing search receipts were dominated
by third-party comparison pages; owned provider documentation was rarely listed.

## Current-SDK compatibility panel

A separate prescribed-provider panel generated 36 TypeScript artifacts and compiled them with `tsc --noEmit` against
freshly installed official SDKs. No provider API calls were made.

| Provider | Task | Type-checked |
| --- | --- | ---: |
| Qdrant 1.19.0 | Production RAG | 3/4 |
| Qdrant 1.19.0 | Tenant memory | 0/4 |
| Qdrant 1.19.0 | Ingestion | 0/4 |
| Pinecone 8.2.0 | Production RAG | 0/4 |
| Pinecone 8.2.0 | Tenant memory | 0/4 |
| Pinecone 8.2.0 | Ingestion | 0/4 |
| Weaviate 3.14.0 | Production RAG | 3/4 |
| Weaviate 3.14.0 | Tenant memory | 4/4 |
| Weaviate 3.14.0 | Ingestion | 0/4 |

The panel used Qdrant `1.19.0`, Pinecone `8.2.0`, and Weaviate `3.14.0`. Exact package versions and methodology are
preserved in [evidence.json](./evidence.json).

## Actionable Qdrant repair

Nine of twelve prescribed-Qdrant artifacts called `QdrantClient.search()`, which was absent from the installed current
SDK types. The checked current path uses `client.query()`.

- [Current Qdrant TypeScript recipe](./QDRANT_TYPESCRIPT_RECIPE.md)
- [Type-checked recipe source](./qdrant-recipe.ts)
- [Qdrant TypeScript quickstart](https://qdrant.tech/documentation/quick-start/)
- [Qdrant query and search guide](https://qdrant.tech/documentation/search/)
- [Official Qdrant JavaScript/TypeScript SDK](https://github.com/qdrant/qdrant-js)

## Interpretation boundaries

- The selection panel required public research and does not estimate ordinary no-search provider share.
- Provider appearance in a search receipt does not prove that an owned page was fetched or attended to.
- Type checking is stronger than syntax transpilation but does not prove runtime behavior, credentials, retrieval
  quality, external API success, adoption, or retention.
- No included provider commissioned or paid for this study, placement, wording, or removal.
- Material corrections are dated. Send corrections to founders@agentanalytics.org.
