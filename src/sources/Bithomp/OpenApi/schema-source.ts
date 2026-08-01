/**
 * Bithomp's official partial OpenAPI 3.1 contract for its Dhali delivery.
 * The API reference states that the same operation paths and query strings apply to the API-key delivery.
 * @see https://docs.bithomp.com/#authentication
 */
export const schemaSource = {
	schemaUrl: 'https://raw.githubusercontent.com/Bithomp/slate/master/source/bithomp-dhali.yaml',
	schemaFile: './openapi.yaml',
	typesFile: './openapi.d.ts',
} as const
