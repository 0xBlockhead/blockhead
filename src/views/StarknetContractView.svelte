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
	}: EntitySelectionViewProps<EntityType.StarknetContract> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.address ?? '') || 'starknet contract')
	const viewDomId = $derived('starknet-contract-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
	import StarknetAccount_TimestampsView from '$/views/StarknetAccount_TimestampsView.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetStorageEntriesView from '$/views/StarknetStorageEntriesView.svelte'
	import StarknetTransactionsView from '$/views/StarknetTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.address ?? '') || 'starknet contract'}
	{/snippet}

	{#snippet Value()}
		<StarknetNetworkView
			selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.address} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-starknet-contract-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-contract-account-states',
						label: 'Account States',
					},
					{
						id: 'starknet-contract-events',
						label: 'Events',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStarknetContractAccountStates({ id, label, open })}
				<StarknetAccount_TimestampsView
					selection={selection.$$accountStates}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No account states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetContractEvents({ id, label, open })}
				<StarknetEventsView
					selection={selection.$$events}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No events.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-starknet-contract-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'starknet-contract-storage',
						label: 'Storage',
					},
					{
						id: 'starknet-contract-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStarknetContractStorage({ id, label, open })}
				<StarknetStorageEntriesView
					selection={selection.$$storage}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No storage.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStarknetContractTransactions({ id, label, open })}
				<StarknetTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
