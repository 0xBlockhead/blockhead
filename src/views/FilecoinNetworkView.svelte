<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.FilecoinNetwork> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
		],
	}))
	const titleFallback = 'filecoin network'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		{titleFallback}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rpcEndpoints.values.map((value) => value.url).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinNetwork_TimestampsView
						selection={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource}
						countResource={filecoinNetworkFilecoinNetworkTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const filecoinNetworkFilecoinTipsetsViewTipsetsResource = selection.$$tipsets}
		<ResourceBoundary
			resource={filecoinNetworkFilecoinTipsetsViewTipsetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinTipsetsView
						selection={filecoinNetworkFilecoinTipsetsViewTipsetsResource}
						countResource={filecoinNetworkFilecoinTipsetsViewTipsetsResource.count}
						title='Tipsets'
						id='tipsets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
