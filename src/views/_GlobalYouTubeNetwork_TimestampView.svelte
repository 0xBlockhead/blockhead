<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalYoutubeNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalYoutubeNetwork_Timestamp>>
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

	const globalYoutubeNetworkTimestamp = $derived(selection({
		fields: {
			sourceWindowChannelCount: true,
			sourceWindowVideoCount: true,
			sourceWindowPlaylistCount: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'YouTube hub observation')
	const viewDomId = $derived('-global-youtube-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(youtube)/youtube/observations/[timestampMs=nonNegativeInteger]/[source]', {
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowChannelCount = prefetched.sourceWindowChannelCount ?? selection.entitySelector.sourceWindowChannelCount}
					{#if sourceWindowChannelCount !== undefined && sourceWindowChannelCount !== null}
						<div>
							<dt>Source-window channels</dt>
							<dd>
								<NumberValue value={Number(sourceWindowChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowChannelCount = entity.sourceWindowChannelCount ?? selection.entitySelector.sourceWindowChannelCount ?? prefetched.sourceWindowChannelCount}
					{#if sourceWindowChannelCount !== undefined && sourceWindowChannelCount !== null}
						<div>
							<dt>Source-window channels</dt>
							<dd>
								<NumberValue value={Number(sourceWindowChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowVideoCount = prefetched.sourceWindowVideoCount ?? selection.entitySelector.sourceWindowVideoCount}
					{#if sourceWindowVideoCount !== undefined && sourceWindowVideoCount !== null}
						<div>
							<dt>Source-window videos</dt>
							<dd>
								<NumberValue value={Number(sourceWindowVideoCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowVideoCount = entity.sourceWindowVideoCount ?? selection.entitySelector.sourceWindowVideoCount ?? prefetched.sourceWindowVideoCount}
					{#if sourceWindowVideoCount !== undefined && sourceWindowVideoCount !== null}
						<div>
							<dt>Source-window videos</dt>
							<dd>
								<NumberValue value={Number(sourceWindowVideoCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowPlaylistCount = prefetched.sourceWindowPlaylistCount ?? selection.entitySelector.sourceWindowPlaylistCount}
					{#if sourceWindowPlaylistCount !== undefined && sourceWindowPlaylistCount !== null}
						<div>
							<dt>Source-window playlists</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPlaylistCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowPlaylistCount = entity.sourceWindowPlaylistCount ?? selection.entitySelector.sourceWindowPlaylistCount ?? prefetched.sourceWindowPlaylistCount}
					{#if sourceWindowPlaylistCount !== undefined && sourceWindowPlaylistCount !== null}
						<div>
							<dt>Source-window playlists</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPlaylistCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalYoutubeNetworkTimestamp}>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
