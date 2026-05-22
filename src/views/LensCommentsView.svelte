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


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		id = 'comments',
		href,
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Comments',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensPost>
			id?: string
			href: string
			limit?: number
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}
	{id}
	{href}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Comments are child publications linked through <code>$$comments</code> on the parent post; each row is a <code>LensPost</code> with <code>$commentOn</code> pointing at the parent id.
		</p>
		<p>
			The thread list resolves via Lens Protocol (GraphQL) and Hey (Lens GraphQL)—not Reddit, Farcaster, or XMTP message models.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No comments yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parentPost = useEntity(
				EntityType.LensPost,
				entityFieldReference.entityId,
				{
					$: [
						Source.Lens_Graphql,
						Source.Lens_HeyGraphql,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Lens_Graphql,
							Source.Lens_HeyGraphql,
						],
						limit,
					},
				},
			)}
			{@const comments = derive(
				parentPost,
				(parentPost) => {
					const rows: Entity<typeof schema, EntityType.LensPost>[] = (
						parentPost[entityFieldReference.fieldName]
						?? []
					)
					return (
						rows
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
				{href}
				{title}
				getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
				getSortValue={(row) => (
					String(row.feedIndex).padStart(6, '0')
				)}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading Lens comments…"
				resource={comments}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No comments yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const commentId = props.item.result[EntityMetaKey.Id]}
						<LensPostView
							entityId={{ id: commentId.id }}
							href={resolve('/(social)/(lens)/lens/post/[postId]', {
								postId: encodeURIComponent(commentId.id),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
