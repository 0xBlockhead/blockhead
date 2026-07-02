<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const youtubeCommentTimestamp = $derived(selection({}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'YouTube comment observation')
	const viewDomId = $derived('youtube-comment-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeComment_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<YoutubeCommentView
				selection={select(EntityType.YoutubeComment, selection.entitySelector.$comment)}
				layout={EntityLayout.Title}
				open={false}
			/>
			{@const timestampMs1 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs1 !== undefined && timestampMs1 !== null}
				<Timestamp timestamp={Number(timestampMs1)} />
			{/if}
		{:else}
			<ResourceBoundary resource={youtubeCommentTimestamp}>
				{#snippet Pending()}
					<YoutubeCommentView
						selection={select(EntityType.YoutubeComment, selection.entitySelector.$comment)}
						layout={EntityLayout.Title}
						open={false}
					/>
					{@const timestampMs1 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<Timestamp timestamp={Number(timestampMs1)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					<YoutubeCommentView
						selection={select(EntityType.YoutubeComment, selection.entitySelector.$comment)}
						layout={EntityLayout.Title}
						open={false}
					/>
					{@const timestampMs1 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<Timestamp timestamp={Number(timestampMs1)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
