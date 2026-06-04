<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id = 'comments',
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Comments',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: Extract<
				EntityFieldReference<typeof schema, EntityType.LensPost>,
				{ entityType: EntityType.LensPost }
			>
			id?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}

	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Comments are child publications linked through <code>$$comments</code> on the parent post; each row is a <code>LensPost</code> with <code>$commentOn</code> pointing at the parent id.
		</p>
		<p>
			The thread lensPosts resolves via Lens Protocol GraphQL endpoints—not Reddit, Farcaster, or XMTP message models.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No comments yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentPost = useEntity(
				EntityType.LensPost,
				entityFieldReference.entityId,
				{
					$: [
						Source.Lens_Graphql,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Lens_Graphql,
						],
						$limit: limit,
					},
				},
			)}
			{@const comments = derive(
				parentPost,
				(parentPost) => {
					const lensPosts: Entity<typeof schema, EntityType.LensPost>[] = (
						parentPost[entityFieldReference.fieldName]
						?? []
					)
					return (
						lensPosts
							.map((comment, feedIndex) => ({
								feedIndex,
								result: comment,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.LensPost}
				id={`${id}-items`}
				{title}
				getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
				getSortValue={(row) => (
					String(row.feedIndex).padStart(6, '0')
				)}
				placeholderText="Loading Lens comments…"
				resource={comments}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No comments yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const commentId = item.result[EntityMetaKey.Id]}
					<LensPostView
						entityId={{ id: commentId.id }}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
