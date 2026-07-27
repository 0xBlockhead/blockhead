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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.minerAddress ?? '') || 'filecoin miner')


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
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				minerAddress: String(selection.entitySelector.minerAddress),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.minerAddress ?? '') || 'filecoin miner'}
	{/snippet}

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
									open={false}
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
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Miner address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.minerAddress} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const filecoinMinerFilecoinMinerTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={filecoinMinerFilecoinMinerTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMiner_TimestampsView
						selection={filecoinMinerFilecoinMinerTimestampsViewTimestampsResource}
						countResource={filecoinMinerFilecoinMinerTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const filecoinMinerFilecoinSectorsViewSectorsResource = selection.$$sectors}
		<ResourceBoundary
			resource={filecoinMinerFilecoinSectorsViewSectorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinSectorsView
						selection={filecoinMinerFilecoinSectorsViewSectorsResource}
						countResource={filecoinMinerFilecoinSectorsViewSectorsResource.count}
						title='Sectors'
						id='sectors'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
