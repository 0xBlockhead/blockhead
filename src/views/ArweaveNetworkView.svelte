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
	}: Omit<EntitySelectionViewProps<EntityType.ArweaveNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('arweave-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ArweaveNetwork_TimestampsView from '$/views/ArweaveNetwork_TimestampsView.svelte'
	import ArweaveBlocksView from '$/views/ArweaveBlocksView.svelte'
	import ArweaveTransactionsView from '$/views/ArweaveTransactionsView.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'arweave network'}
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

	{#snippet Value()}
		Arweave
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
			id={viewDomId + '-carousel-arweave-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'arweave-chain-observations',
						label: 'Observations',
					},
					{
						id: 'arweave-chain-blocks',
						label: 'Blocks',
					},
					{
						id: 'arweave-chain-transactions',
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

			{#snippet SectionArweaveChainObservations({ id, label })}
				<ArweaveNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Arweave network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveChainBlocks({ id, label })}
				<ArweaveBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Arweave blocks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionArweaveChainTransactions({ id, label })}
				<ArweaveTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No Arweave transactions.'
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
					selection={selection.$$resources}
					collapsible={false}
					title={label}
					emptyText='No Arweave resources.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
