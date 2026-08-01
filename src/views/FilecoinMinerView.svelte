<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FilecoinMiner> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMiner_TimestampsView from '$/views/FilecoinMiner_TimestampsView.svelte'
	import FilecoinSectorsView from '$/views/FilecoinSectorsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMiner}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.minerAddress || 'filecoin miner')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					minerAddress: selection.entitySelector.minerAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
							.$$timestamps({
								sources: [
									Source.Lotus_JsonRpc,
								],
								fields: {
									height: true,
									timestampMs: true,
									qualityAdjustedPower: true,
									liveSectorCount: true,
									source: true,
								},
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].height ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							})
						}
					>
						{#snippet children(filecoinMinerTimestamps)}
							{@const filecoinMinerTimestamp = filecoinMinerTimestamps.values[0]}
							{#if filecoinMinerTimestamp != null}
								{@const filecoinMinerTimestampSelector = filecoinMinerTimestamp[EntityMetaKey.Selector]}
								<FilecoinMiner_TimestampView
									selection={
										select(EntityType.FilecoinMiner_Timestamp, filecoinMinerTimestampSelector, {
											sources: [
												Source.Lotus_JsonRpc,
											],
										})
									}
									prefetched={{ ...filecoinMinerTimestampSelector, ...filecoinMinerTimestamp }}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest observation available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Miner address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.minerAddress} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMiner_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const sectorsResource = selection.$$sectors}
		<ResourceBoundary
			resource={sectorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinSectorsView
						selection={sectorsResource}
						countResource={sectorsResource.count}
						title='Sectors'
						id='sectors'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
