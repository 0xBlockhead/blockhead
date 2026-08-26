<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AptosNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('aptos-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AptosNetwork_TimestampsView from '$/views/AptosNetwork_TimestampsView.svelte'
	import AptosBlocksView from '$/views/AptosBlocksView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosEventsView from '$/views/AptosEventsView.svelte'
	import AptosAccountsView from '$/views/AptosAccountsView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'aptos network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-chain-observations',
						label: 'Observations',
					},
					{
						id: 'aptos-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'aptos-chain-transactions',
						label: 'Transactions',
					},
					{
						id: 'aptos-chain-events',
						label: 'Events',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosChainObservations({ id, label })}
				<AptosNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Aptos network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosChainBlocks({ id, label })}
				<AptosBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Aptos blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosChainTransactions({ id, label })}
				<AptosTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Aptos transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosChainEvents({ id, label })}
				<AptosEventsView
					selection={selection.$$events}
					collapsible={false}
					title={label}
					emptyText='No Aptos events.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-accounts-modules'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-accounts',
						label: 'Accounts',
					},
				]
			}
			data-card
			class='network-view-collapsible-accounts-modules'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts and modules</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosAccounts({ id, label })}
				<AptosAccountsView
					selection={selection.$$accounts}
					collapsible={false}
					title={label}
					emptyText='No Aptos accounts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-balances'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-coin-balances',
						label: 'Coin balances',
					},
				]
			}
			data-card
			class='network-view-collapsible-balances'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balances</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosCoinBalances({ id, label })}
				<AptosCoinBalance_TimestampsView
					selection={selection.$$coinBalanceTimestamps}
					collapsible={false}
					title={label}
					emptyText='No Aptos coin balance observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
