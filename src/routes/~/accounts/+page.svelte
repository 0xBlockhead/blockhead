<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import BlockheadBridgeTransactionsView from '$/views/BlockheadBridgeTransactionsView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Accounts • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='accounts:hub'
		sectionIdPrefix='accounts'
		sections={[
			{ id: 'connections', label: 'Connections' },
			{ id: 'watched-accounts', label: 'Watched accounts' },
			{ id: 'balances', label: 'Balances' },
			{ id: 'allowances', label: 'Allowances' },
			{ id: 'transactions', label: 'Transactions' },
		]}
		data-card
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: 40ch',
		}}
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Accounts</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionConnections()}
			<BlockheadWalletConnectionsView
				href={resolve('/~/accounts/connections')}
				selection={select(EntityType._Global, { scope: '$$blockheadWalletConnections' }).$$blockheadWalletConnections({
					sources: [Source.Local_Internal],
				})}
				id='wallet-connections'
				open={true}
			/>
		{/snippet}

		{#snippet SectionWatchedAccounts()}
			<EvmAccountsView
				href={resolve('/~/accounts/watched-accounts')}
				selection={select(EntityType._Global, { scope: '$$actors' }).$$actors({
					sources: [Source.Local_Internal],
				})}
				id='accounts'
				open={true}
			/>
		{/snippet}

		{#snippet SectionBalances()}
			<EvmNetworkActorCoinBalancesView
				href={resolve('/~/accounts/balances')}
				selection={select(EntityType._Global, { scope: '$$actorCoins' }).$$actorCoins({
					sources: [Source.Allium_Rest],
				})}
				id='balances'
				open={true}
			/>
		{/snippet}

		{#snippet SectionAllowances()}
			<h2><a href={resolve('/~/accounts/allowances')}>Allowances</a></h2>
			<p data-text='muted'>
				Check ERC-20 allowances from known owner, token, and spender addresses.
			</p>
		{/snippet}

		{#snippet SectionTransactions()}
			<BlockheadBridgeTransactionsView
				href={resolve('/~/accounts/transactions')}
				selection={select(EntityType._Global, { scope: '$$bridgeTransactions' }).$$bridgeTransactions({
					sources: [Source.Local_Internal],
				})}
				id='transactions'
				open={true}
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
