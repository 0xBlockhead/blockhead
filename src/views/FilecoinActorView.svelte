<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.FilecoinActor>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FilecoinActor>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const filecoinActor = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'filecoin actor')
	const viewDomId = $derived('filecoin-actor-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinActor_TimestampsView from '$/views/FilecoinActor_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinActor_TimestampView from '$/views/FilecoinActor_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinActor}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'address' in selection.entitySelector
			&& selection.entitySelector.address != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
				address: String(selection.entitySelector.address ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
					address: String(selection.entitySelector.address ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={filecoinActor}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
									href={
										(
											filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'height' in filecoinActorTimestamp[EntityMetaKey.Selector]
											&& filecoinActorTimestamp[EntityMetaKey.Selector].height != null
											&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'tipsetKey' in filecoinActorTimestamp[EntityMetaKey.Selector]
											&& filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey != null
											&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && 'source' in filecoinActorTimestamp[EntityMetaKey.Selector]
											&& filecoinActorTimestamp[EntityMetaKey.Selector].source != null
											&& filecoinActorTimestamp[EntityMetaKey.Selector] != null && '$actor' in filecoinActorTimestamp[EntityMetaKey.Selector]
											&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor != null && 'address' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor
											&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address != null
											&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor != null && '$network' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor ?
												filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network != null && 'caip2' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network
												&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
												height: String(filecoinActorTimestamp[EntityMetaKey.Selector].height ?? ''),
												tipsetKey: String(filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
												source: String(filecoinActorTimestamp[EntityMetaKey.Selector].source ?? ''),
												address: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address ?? ''),
												network: String(caip2StringFromValue(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.caip2) ?? ''),
											})
											:
													filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network != null && 'slug' in filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network
													&& filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
													height: String(filecoinActorTimestamp[EntityMetaKey.Selector].height ?? ''),
													tipsetKey: String(filecoinActorTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
													source: String(filecoinActorTimestamp[EntityMetaKey.Selector].source ?? ''),
													address: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.address ?? ''),
													network: String(filecoinActorTimestamp[EntityMetaKey.Selector].$actor.$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const filecoinActorFilecoinActorTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Lotus_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={filecoinActorFilecoinActorTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<FilecoinActor_TimestampsView
							selection={filecoinActorFilecoinActorTimestampsViewTimestampsResource}
							countResource={filecoinActorFilecoinActorTimestampsViewTimestampsResource.count}
							title='Observations'
							id='FilecoinActor_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
