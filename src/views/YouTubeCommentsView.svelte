<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id,
		limit = 10,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Top-level comments',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YouTubeComment>
			id: string
			limit?: number
			open?: boolean
			title?: string
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubeComment}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Top-level comments youTubeComments here; reply youTubeComments link to a parent comment on the same video id + comment id pair.
		</p>
		<p>
			Youtube_Rest returns ISO publishedAt; Piped uses its own time strings—not Reddit fullnames or Nostr event ids.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No comments yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
						resource={selection({
							sources: [
								Source.Constants_Internal,
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
						limit,
					})}
				placeholderText="Loading comment thread…"
			>
				{#snippet children(comments)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.YouTubeComment}
						id={`${id}-items`}
						{title}
						items={comments.values}
						placeholderText="Loading comment thread…"
						getKey={(comment) => stringify(comment.entitySelector)}
						getSortValue={(comment) => comment.entitySelector.commentId}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No comments yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve(
									'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
									{
										videoId: encodeURIComponent(item.entitySelector.videoId),
										commentId: encodeURIComponent(item.entitySelector.commentId),
									},
								)}
							>
								<TruncatedValue
									value={item.entitySelector.commentId}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
