import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import PayjoinDirectoryRest from '$/sources/Payjoin/Directory/Rest/index.ts'

export default {
	provider: SourceProvider.Payjoin,
	label: 'Payjoin',
	origins: [
		{
			origin: 'https://payjo.in',
			corsEnabled: false,
		},
		{
			origin: 'http://127.0.0.1:8080',
			corsEnabled: false,
		},
		{
			origin: 'http://localhost:8080',
			corsEnabled: false,
		},
	],
	sources: [
		PayjoinDirectoryRest,
	],
} as const satisfies SourceProviderDefinition
