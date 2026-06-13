<script module lang="ts">
	// Polyfills
	import '$/polyfills.ts'

	import { QueryClient } from '@tanstack/query-core'
	import {
		createBrowserWASQLitePersistence,
		openBrowserWASQLiteOPFSDatabase,
	} from '@tanstack/browser-db-sqlite-persistence'
	import { env } from '$env/dynamic/public'

	import {
		client,
		subscribeEntity,
		type SubscribeSelection,
	} from '$/client/$client.svelte.ts'
	import { BLOCKHEAD_WA_SQLITE_DATABASE_NAME } from '$/constants/Persistence.ts'
	import { resolvers } from '$/resolvers/index.ts'
	import { schema } from '$/schema/index.ts'
	import type { EntityId, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import { sourceProviders } from '$/sources/index.ts'

	const appClient = client({
		schema,
		sourceProviders,
	})({
		resolvers,
		env,
	})({
		queryClient: new QueryClient(),
		persistence: createBrowserWASQLitePersistence({
			database: await openBrowserWASQLiteOPFSDatabase({
				databaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME,
			}),
		}),
	})

	if (typeof window !== 'undefined' && '__blockheadPersistenceProbe' in window)
		Object.defineProperty(window, '__blockheadClientProbe', {
			value: {
				events: appClient.events,
				collectionSizes: () => ({
					entities: Object.fromEntries(Object.entries(appClient.entityCollections).map(([entityType, collection]) => [
						entityType,
						collection.size,
					])),
					fields: Object.fromEntries(Object.entries(appClient.entityFieldCollections).map(([entityType, fieldCollections]) => [
						entityType,
						Object.fromEntries(Object.entries(fieldCollections).map(([fieldName, collection]) => [
							fieldName,
							collection.size,
						])),
					])),
					counts: Object.fromEntries(Object.entries(appClient.entityFieldCountCollections).map(([entityType, fieldCollections]) => [
						entityType,
						Object.fromEntries(Object.entries(fieldCollections).map(([fieldName, collection]) => [
							fieldName,
							collection?.size ?? 0,
						])),
					])),
				}),
				read: <
					const _EntityType extends EntityTypeName<typeof schema>,
					const _Selection extends SubscribeSelection<typeof schema, _EntityType>,
				>(
					entityType: _EntityType,
					entityId: EntityId<typeof schema, _EntityType>,
					selection: _Selection,
				) => subscribeEntity<typeof schema, _EntityType, _Selection>(
					appClient,
					entityType,
					entityId,
					selection,
				),
			},
			configurable: true,
		})

	export const subscribe = appClient.subscribe
	export const entityCollectionByEntityType = appClient.entityCollections
	export const entityFieldCollections = appClient.entityFieldCollections
	export const entityFieldCountCollections = appClient.entityFieldCountCollections
	export const entityCollectionsQueryClient = appClient.queryClient
</script>


<script lang="ts">
	// Types/constants
	import '$/styles/fonts.css'
	import '$/styles/colors.css'
	import '$/styles/reset.css'
	import '$/styles/components.css'


	// View transitions


	// Context
	import {
		mountWalletConnectionRuntime,
	} from '$/state/wallets/walletConnectionRuntime.svelte.ts'
	import { useNavigationItems } from './navigationItems.svelte.ts'


	// State
	let {
		children,
	} = $props()

	$effect(() => (
		mountWalletConnectionRuntime().destroy
	))

	// Components
	import Navigation from './Navigation.svelte'


	// Functions
	import { asset } from '$app/paths'
</script>


<svelte:head>
	<link
		rel="icon"
		href={asset('/favicon.svg')}
	/>
</svelte:head>


<div
	id="layout"
	data-scroll-container="layout-inline-panes snap-inline"
	data-sticky-container
>
	<a
		href="#main"
		class="skip-link"
	>
		Skip to main content
	</a>

	<Navigation
		navigationItems={useNavigationItems().navigationItems}
	/>

	<div
		id="main"
		tabindex="-1"
		data-scroll-item="pane-flexible"
		data-sticky-container
		data-column
	>
		<div
			class="layout-main"
			data-column-item="flexible"
			data-column
		>
			{@render children()}
		</div>
	</div>
</div>


<style>
	#layout {
		--navigation-desktop-inlineSize: 16rem;
		--navigation-mobile-blockSize: 4rem;

		inline-size: 100dvw;
		block-size: 100dvh;
		padding: var(--safeArea-insetTop) var(--safeArea-insetRight) var(--safeArea-insetBottom) var(--safeArea-insetLeft);
		align-items: start;
		gap: var(--separator-width);

		&[data-scroll-container] {
			--sticky-paddingBlockStart: var(--safeArea-insetTop);
			--sticky-paddingBlockEnd: var(--safeArea-insetBottom);
			--sticky-paddingInlineStart: var(--safeArea-insetLeft);
			--sticky-paddingInlineEnd: var(--safeArea-insetRight);
		}

		@media (width >= 60rem) {
			&[data-scroll-container~='layout-inline-panes'] {
				--scrollPanes-paneStatic-inlineSize: var(--navigation-desktop-inlineSize);
			}
		}

		> :global(.layout-nav) {
			box-shadow: 0 0 0 var(--separator-width) var(--border-color);
		}

		> #main {
			--sticky-paddingInlineStart: clamp(1rem, 6cqi, 2rem);
			--sticky-paddingInlineEnd: clamp(1rem, 6cqi, 2rem);
			--sticky-paddingBlockStart: 1.5rem;
			--sticky-paddingBlockEnd: 1.5rem;

			align-self: stretch;
			padding: 1.5rem;

			> .layout-main {
				view-transition-name: Main;

				min-height: calc(100% - 3rem);

				> :global([data-scroll-container]:only-child) {
					--scrollContainer-sizeBlock: calc(100cqb - 3rem);
				}
			}
		}
	}


	.skip-link {
		position: absolute;
		top: -100%;
		left: 0;
		padding: 0.5em 1em;
		background: var(--color-bg-page);
		z-index: 1000;
		color: var(--color-fg);

		&:focus {
			top: 0;
		}
	}

	::view-transition-old(Main) {
		animation: 0.2s var(--transition-easeOutExpo) both MainTransitionOut;
	}
	::view-transition-new(Main) {
		animation: 0.2s var(--transition-easeOutExpo) both MainTransitionIn;
	}
	@keyframes MainTransitionIn {
		from {
			opacity: 0;
			scale: 0.95;
			filter: blur(2px);
		}
	}
	@keyframes MainTransitionOut {
		to {
			opacity: 0;
			scale: 0.95;
			filter: blur(2px);
		}
	}
</style>
