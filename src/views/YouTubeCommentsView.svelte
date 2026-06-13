<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Top-level comments',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeComment>
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

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YouTubeCommentView from '$/views/YouTubeCommentView.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						limit,
					},
				} }),
			)}
			{@const comments = derive(
				parent,
				(parent) => {
					const youTubeComments: readonly Entity<typeof schema, EntityType.YouTubeComment>[] = parent.fields[entityFieldReference.fieldName]?.values ?? []
					return youTubeComments.map((comment) => comment[EntityMetaKey.Id])
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubeComment}
				id={`${id}-items`}
				{title}
				resource={comments}
				placeholderText="Loading comment thread…"
				getKey={(row) => stringify(row)}
				getSortValue={(row) => row.commentId}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No comments yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: comment,
				})}
					<YouTubeCommentView
						entityId={{
							videoId: comment.videoId,
							commentId: comment.commentId,
						}}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
