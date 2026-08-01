/**
 * Starkscan's official public explorer API contract.
 * @see https://starkscan.co/docs/api
 */
export const schemaSource = {
	schemaUrl: 'https://starkscan.co/starkscan-openapi.yaml',
	schemaFile: './openapi.yaml',
	typesFile: './openapi.d.ts',
} as const
