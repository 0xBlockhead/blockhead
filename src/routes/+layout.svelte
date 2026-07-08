<script module lang="ts">
	// Polyfills
	import '$/polyfills.ts'

	import { QueryClient } from '@tanstack/query-core'
	import {
		createBrowserWASQLitePersistence,
	} from '@tanstack/browser-db-sqlite-persistence'
	import { env } from '$env/dynamic/public'

	import {
		client,
	} from '$/client/$client.svelte.ts'
	import {
		createE2EClientInstrumentation,
		e2eDatabaseName,
		e2eSchemaVersion,
		e2eVfsName,
		installAppClientProbe,
		openBlockheadBrowserDatabase,
	} from '$/client/$e2eProbe.ts'
	import {
		BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,
		BLOCKHEAD_WA_SQLITE_DATABASE_NAME,
	} from '$/constants/Persistence.ts'
	import { resolvers } from '$/resolvers/index.ts'
	import { schema } from '$/schema/index.ts'
	import { sourceProviders } from '$/sources/index.ts'

	const database = await openBlockheadBrowserDatabase({
		databaseName: e2eDatabaseName(BLOCKHEAD_WA_SQLITE_DATABASE_NAME),
		vfsName: e2eVfsName(),
	})
	let databaseClosed = false
	const closeDatabase = () => {
		if (databaseClosed)
			return

		databaseClosed = true
		void database.close?.()
	}
	window.addEventListener('pagehide', closeDatabase, { once: true })
	import.meta.hot?.dispose(closeDatabase)

	const basePersistence = createBrowserWASQLitePersistence({
		database,
		schemaMismatchPolicy: 'reset',
	})
	const e2eInstrumentation = createE2EClientInstrumentation(basePersistence)

	export const appClient = client(
		{
			schema,
			sourceProviders,
		}
	)(
		{
			resolvers,
			env,
		}
	)(
		{
			queryClient: new QueryClient({
				defaultOptions: {
					queries: {
						gcTime: 0,
					},
				},
			}),
			persistence: e2eInstrumentation.persistence,
			schemaVersion: e2eSchemaVersion(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION),
			waitForPersistence: e2eInstrumentation.waitForPersistence,
		}
	)

	export const select = appClient.select
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
	import { navigationItems } from './navigationItems.svelte.ts'


	// State
	let {
		children,
	} = $props()

	installAppClientProbe(appClient)

	$effect(() => (
		mountWalletConnectionRuntime(appClient)
			.destroy
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
		{navigationItems}
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
