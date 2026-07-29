<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalArweaveNetwork> = $props()

	const titleFallback = 'global Arweave network'
	const viewDomId = $derived('-global-arweave-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ArweaveNetworksView from '$/views/ArweaveNetworksView.svelte'
	import ArweaveBlocksView from '$/views/ArweaveBlocksView.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalArweaveNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global Arweave network
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.scope || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-arweave-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'arweave-networks',
						label: 'Networks',
					},
					{
						id: 'arweave-blocks',
						label: 'Blocks',
					},
					{
						id: 'arweave-transactions',
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

			{#snippet SectionArweaveNetworks({ id, label, open })}
				<ArweaveNetworksView
					selection={selection.$$observedNetworks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Arweave networks in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveBlocks({ id, label, open })}
				<ArweaveBlocksView
					selection={selection.$$observedBlocks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Arweave blocks in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveTransactions({ id, label, open })}
				<ArweaveTransactionsView
					selection={selection.$$observedTransactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Arweave transactions in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-arweave-resources'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'arweave-resource-list',
						label: 'Resources',
					},
				]
			}
			data-card
			class='network-view-collapsible-resources'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionArweaveResourceList({ id, label, open })}
				<ArweaveResourcesView
					selection={selection.$$observedResources}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Arweave resources in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
