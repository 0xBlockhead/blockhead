/**
 * Rekor v1's official public API contract.
 * @see https://github.com/sigstore/rekor/blob/main/openapi.yaml
 */
export const schemaSource = {
	schemaUrl: 'https://raw.githubusercontent.com/sigstore/rekor/main/openapi.yaml',
	schemaFile: './openapi.yaml',
	typesFile: './openapi.d.ts',
} as const
