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
	}: EntitySelectionViewProps<EntityType.CelestiaNetwork> = $props()

	const viewDomId = $derived('celestia-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CelestiaNetwork_TimestampsView from '$/views/CelestiaNetwork_TimestampsView.svelte'
	import CelestiaBlocksView from '$/views/CelestiaBlocksView.svelte'
	import CelestiaNamespacesView from '$/views/CelestiaNamespacesView.svelte'
	import CelestiaBlobsView from '$/views/CelestiaBlobsView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'celestia network'}
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

	{#snippet Content({ open: contentOpen })}
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

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-celestia-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'celestia-chain-observations',
						label: 'Observations',
					},
					{
						id: 'celestia-chain-blocks',
						label: 'Blocks',
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

			{#snippet SectionCelestiaChainObservations({ id, label, open })}
				<CelestiaNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCelestiaChainBlocks({ id, label, open })}
				<CelestiaBlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No blocks found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-celestia-data-availability'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'celestia-namespaces',
						label: 'Namespaces',
					},
					{
						id: 'celestia-blobs',
						label: 'Blobs',
					},
				]
			}
			data-card
			class='network-view-collapsible-data-availability'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Data availability</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCelestiaNamespaces({ id, label, open })}
				<CelestiaNamespacesView
					selection={selection.$$namespaces}
					collapsible={false}
					title={label}
					emptyText='No namespaces found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCelestiaBlobs({ id, label, open })}
				<CelestiaBlobsView
					selection={selection.$$blobs}
					collapsible={false}
					title={label}
					emptyText='No blobs found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
