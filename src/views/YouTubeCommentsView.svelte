<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
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
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


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
			Top-level comments list here; reply rows link to a parent comment on the same video id + comment id pair.
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
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						limit,
					},
				},
			)}
			{@const comments = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.YouTubeComment>[] = parent[entityFieldReference.fieldName] ?? []
					return rows.map((comment) => comment[EntityMetaKey.Id])
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
				getSortValue={(row) => (
					`${String(-(Date.parse(row.publishedAt ?? '') || 0)).padStart(20, '0')}\0${row.commentId}`
				)}
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
