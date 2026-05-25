<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
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
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				sectionIdPrefix={hubKey}
				sections={[
					{ id: 'connections', label: 'Connections' },
					{ id: 'wallets', label: 'Wallets' },
					{ id: 'balances', label: 'Balances' },
				]}
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

				{#snippet SectionConnections({ id, label })}
					<BlockheadWalletConnectionsView
						id="wallet-connections"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionWallets({ id, label })}
					<ActorsView
						href={resolve('/~/accounts')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$actors',
						}}
						id="accounts"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionBalances({ id, label })}
					<ActorCoinsView
						href={resolve('/~/(accounts)/accounts/balances')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$actorCoins',
						}}
						id="balances"
						open={hubOpen}
					/>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
