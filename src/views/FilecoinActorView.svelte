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
	}: EntitySelectionViewProps<EntityType.FilecoinActor> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.address ?? '') || 'filecoin actor')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinActor_TimestampsView from '$/views/FilecoinActor_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinActor}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				address: String(selection.entitySelector.address),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.address ?? '') || 'filecoin actor'}
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
										balanceAttoFil: true,
										source: true,
									},
									limit: 1,
									orderBy: [
										[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].height ?? Number.NEGATIVE_INFINITY, 'desc'],
									],
								})
						}
					>
						{#snippet children(filecoinActorTimestamps)}
							{@const filecoinActorTimestamp = filecoinActorTimestamps.values[0]}
							{#if filecoinActorTimestamp != null}
								{@const filecoinActorTimestampSelector = filecoinActorTimestamp[EntityMetaKey.Selector]}
								<FilecoinActor_TimestampView
									selection={
										select(EntityType.FilecoinActor_Timestamp, filecoinActorTimestampSelector, {
											sources: [
												Source.Lotus_JsonRpc,
											],
										})
									}
									prefetched={{ ...filecoinActorTimestampSelector, ...filecoinActorTimestamp }}
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
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.address} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const filecoinActorFilecoinActorTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={filecoinActorFilecoinActorTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinActor_TimestampsView
						selection={filecoinActorFilecoinActorTimestampsViewTimestampsResource}
						countResource={filecoinActorFilecoinActorTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
