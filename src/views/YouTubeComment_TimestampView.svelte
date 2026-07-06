<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.YoutubeComment_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.YoutubeComment_Timestamp>>
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
	const youtubeCommentTimestamp = $derived(selection({}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'YouTube comment observation')
	const viewDomId = $derived('youtube-comment-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeComment_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$comment !== undefined && pendingEntity.$comment.videoId !== undefined && pendingEntity.$comment !== undefined && pendingEntity.$comment.commentId !== undefined && pendingEntity.timestampMs !== undefined ? resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]', {
			videoId: String(pendingEntity.$comment.videoId ?? ''),
			commentId: String(pendingEntity.$comment.commentId ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={youtubeCommentTimestamp}>
			{#snippet Pending()}
				<YoutubeCommentView
					selection={select(EntityType.YoutubeComment, selection.entitySelector.$comment)}
					layout={EntityLayout.Title}
					open={false}
				/>
				{@const timestampMs1 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs1 !== undefined && timestampMs1 !== null}
					<Timestamp timestamp={Number(timestampMs1)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<YoutubeCommentView
					selection={select(EntityType.YoutubeComment, selection.entitySelector.$comment)}
					layout={EntityLayout.Title}
					open={false}
				/>
				{@const timestampMs1 = resolvedEntity.timestampMs}
				{#if timestampMs1 !== undefined && timestampMs1 !== null}
					<Timestamp timestamp={Number(timestampMs1)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
		</dl>
	{/snippet}
</EntityView>
