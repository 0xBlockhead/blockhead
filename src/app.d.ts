// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$/routes/+layout.svelte' {
	import type { QueryClient } from '@tanstack/query-core'

	import type {
		EntityCollections,
		EntityFieldCountCollections,
		EntityFieldCollections,
	} from '$/collections/$collections.ts'
	import type { schema } from '$/schema/index.ts'

	export const entityCollectionByEntityType: EntityCollections<typeof schema>
	export const entityFieldCollections: EntityFieldCollections<typeof schema>
	export const entityFieldCountCollections: EntityFieldCountCollections<typeof schema>
	export const entityCollectionsQueryClient: QueryClient
}

export {}
