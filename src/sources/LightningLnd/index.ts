import { type as arktype } from 'arktype'

import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import LightningLndRest from '$/sources/LightningLnd/Rest/index.ts'

export default {
	provider: SourceProvider.LightningLnd,
	label: 'LND',
	env: arktype({
		PUBLIC_LND_MACAROON_HEX: 'string',
		PUBLIC_LND_REST_BASE_URL: 'string',
	}),
	origins: [
		{
			origin: 'https://127.0.0.1:8080',
			corsEnabled: false,
		},
		{
			origin: 'http://127.0.0.1:8080',
			corsEnabled: false,
		},
		{
			origin: 'https://localhost:8080',
			corsEnabled: false,
		},
		{
			origin: 'http://localhost:8080',
			corsEnabled: false,
		},
	],
	sources: [
		LightningLndRest,
	],
} as const satisfies SourceProviderDefinition
