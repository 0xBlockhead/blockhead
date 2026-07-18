<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import WalletConnectionsControl from '$/components/WalletConnectionsControl.svelte'
	import BlockheadBridgeTransactionsView from '$/views/BlockheadBridgeTransactionsView.svelte'
	import WalletAccountPortfolio from '$/components/WalletAccountPortfolio.svelte'
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
			<WalletConnectionsControl
				id='wallet-connections'
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
						data-column-item='flexible'
						data-card
						data-scroll-container
			/>
		{/snippet}

		{#snippet SectionBalances()}
			<WalletAccountPortfolio id='accounts-balances' />
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
						data-column-item='flexible'
						data-card
						data-scroll-container
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
