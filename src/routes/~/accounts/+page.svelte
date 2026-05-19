<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	const hubKey = 'accounts'


	// Components
	import ActorCoinsView from '$/views/ActorCoinsView.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Accounts"
		href={resolve('/~/accounts')}
	>
		{#snippet children({
			open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 40ch',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Accounts
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Connections"
						href={`#${hubKey}:connections`}
					>Connections</a>
					<a
						data-scroll-marker-label="Wallets"
						href={`#${hubKey}:wallets`}
					>Wallets</a>
					<a
						data-scroll-marker-label="Balances"
						href={`#${hubKey}:balances`}
					>Balances</a>
				{/snippet}

				{#snippet children({ open: _paneOpen })}
					<section
						id={`${hubKey}:connections`}
						data-scroll-marker-label="Connections"
					>
						<BlockheadWalletConnectionsView
							href={resolve('/~/accounts')}
							id="wallet-connections"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:wallets`}
						data-scroll-marker-label="Wallets"
					>
						<ActorsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$actors',
							}}
							href={resolve('/~/accounts')}
							id="accounts"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:balances`}
						data-scroll-marker-label="Balances"
					>
						<ActorCoinsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$actorCoins',
							}}
							href={resolve('/~/accounts/balances')}
							id="balances"
							open={hubOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
