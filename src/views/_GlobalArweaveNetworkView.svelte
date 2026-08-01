<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalArweaveNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('-global-arweave-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ArweaveNetworksView from '$/views/ArweaveNetworksView.svelte'
	import ArweaveBlocksView from '$/views/ArweaveBlocksView.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalArweaveNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.scope}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionArweaveNetworks({ id, label })}
				<ArweaveNetworksView
					selection={selection.$$observedNetworks}
					collapsible={false}
					title={label}
					emptyText='No Arweave networks in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveBlocks({ id, label })}
				<ArweaveBlocksView
					selection={selection.$$observedBlocks}
					collapsible={false}
					title={label}
					emptyText='No Arweave blocks in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveTransactions({ id, label })}
				<ArweaveTransactionsView
					selection={selection.$$observedTransactions}
					collapsible={false}
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

			{#snippet SectionArweaveResourceList({ id, label })}
				<ArweaveResourcesView
					selection={selection.$$observedResources}
					collapsible={false}
					title={label}
					emptyText='No Arweave resources in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
