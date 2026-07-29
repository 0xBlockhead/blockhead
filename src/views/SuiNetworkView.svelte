<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SuiNetwork> = $props()

	const viewDomId = $derived('sui-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import SuiNetwork_TimestampsView from '$/views/SuiNetwork_TimestampsView.svelte'
	import SuiCheckpointsView from '$/views/SuiCheckpointsView.svelte'
	import SuiTransactionsView from '$/views/SuiTransactionsView.svelte'
	import SuiObjectsView from '$/views/SuiObjectsView.svelte'
	import SuiPackagesView from '$/views/SuiPackagesView.svelte'
	import SuiAccountsView from '$/views/SuiAccountsView.svelte'
	import SuiCoinTypesView from '$/views/SuiCoinTypesView.svelte'
	import SuiCoinBalance_TimestampsView from '$/views/SuiCoinBalance_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'Sui network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-chain-observations',
						label: 'Observations',
					},
					{
						id: 'sui-chain-checkpoints',
						label: 'Checkpoints',
					},
					{
						id: 'sui-chain-transactions',
						label: 'Transactions',
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

			{#snippet SectionSuiChainObservations({ id, label, open })}
				<SuiNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiChainCheckpoints({ id, label, open })}
				<SuiCheckpointsView
					selection={selection.$$checkpoints}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui checkpoints.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiChainTransactions({ id, label, open })}
				<SuiTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-objects-packages'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-objects',
						label: 'Objects',
					},
					{
						id: 'sui-packages',
						label: 'Packages',
					},
				]
			}
			data-card
			class='network-view-collapsible-objects-packages'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Objects and packages</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiObjects({ id, label, open })}
				<SuiObjectsView
					selection={selection.$$objects}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui objects.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiPackages({ id, label, open })}
				<SuiPackagesView
					selection={selection.$$packages}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui packages.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-sui-accounts-coins'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'sui-accounts',
						label: 'Accounts',
					},
					{
						id: 'sui-coin-types',
						label: 'Coin types',
					},
					{
						id: 'sui-coin-balances',
						label: 'Coin balances',
					},
				]
			}
			data-card
			class='network-view-collapsible-accounts-coins'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts and coins</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSuiAccounts({ id, label, open })}
				<SuiAccountsView
					selection={selection.$$accounts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui accounts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiCoinTypes({ id, label, open })}
				<SuiCoinTypesView
					selection={selection.$$coinTypes}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui coin types.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSuiCoinBalances({ id, label, open })}
				<SuiCoinBalance_TimestampsView
					selection={selection.$$coinBalanceTimestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Sui coin balance observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
