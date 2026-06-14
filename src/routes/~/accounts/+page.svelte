<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'accounts'


	// Components
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		selector={{ scope: 'Accounts' }}
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
					{ id: 'watched-accounts', label: 'Watched accounts' },
					{ id: 'balances', label: 'Balances' },
				]}
				data-card
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

				{#snippet SectionWatchedAccounts({ id, label })}
					<EvmAccountsView
						href={resolve('/~/accounts/watched-accounts')}
						entityFieldReference={{
							entityType: EntityType._Global,
							selector: { scope: '$$actors' },
							fieldName: '$$actors',
						}}
						id="accounts"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionBalances({ id, label })}
					<EvmNetworkActorCoinBalancesView
						href={resolve('/~/accounts/balances')}
						entityFieldReference={{
							entityType: EntityType._Global,
							selector: { scope: '$$actorCoins' },
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
