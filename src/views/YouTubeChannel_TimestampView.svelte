<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.YoutubeChannel_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.YoutubeChannel_Timestamp>>
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
	const youtubeChannelTimestamp = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? ''), String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation')
	const viewDomId = $derived('youtube-channel-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeChannel_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$channel !== undefined && pendingEntity.$channel.channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			channelId: encodeURIComponent(String(pendingEntity.$channel.channelId ?? '')),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<YoutubeChannelView
						selection={select(EntityType.YoutubeChannel, selection.entitySelector.$channel)}
						href={
						(selection.entitySelector.$channel.channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
							channelId: encodeURIComponent(String(selection.entitySelector.$channel.channelId ?? '')),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
					{@const timestampMs1 = pendingEntity.timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<Timestamp timestamp={Number(timestampMs1)} />
					{/if}
					{@const source2 = pendingEntity.source}
					{#if source2 !== undefined && source2 !== null}
						{String((source2) ?? '')}
					{/if}
		{:else}
			<ResourceBoundary resource={youtubeChannelTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<YoutubeChannelView
						selection={select(EntityType.YoutubeChannel, selection.entitySelector.$channel)}
						href={
						(selection.entitySelector.$channel.channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]', {
							channelId: encodeURIComponent(String(selection.entitySelector.$channel.channelId ?? '')),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
					{@const timestampMs1 = resolvedEntity.timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<Timestamp timestamp={Number(timestampMs1)} />
					{/if}
					{@const source2 = resolvedEntity.source}
					{#if source2 !== undefined && source2 !== null}
						{String((source2) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
