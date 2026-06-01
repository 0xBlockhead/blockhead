/**
 * Copy this file when onboarding another OpenAPI-backed provider in `src/sources/<Provider>/OpenApi/`.
 *
 * Required fields:
 * - `schemaUrl`: canonical upstream OpenAPI/Swagger URL
 * - `schemaFile`: checked-in downloaded schema path, relative to this file
 * - `typesFile`: generated `openapi.d.ts` path, relative to this file
 */
export const schemaSource = {
	schemaUrl: 'https://raw.githubusercontent.com/DefiLlama/api-docs/main/defillama-openapi-free.json',
	schemaFile: './openapi.json',
	typesFile: './openapi.d.ts',
} as const
