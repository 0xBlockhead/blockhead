<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 50,
		open = $bindable(true),
		title = 'Top-level comments',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditComment>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Reddit_Rest,
			],
			[fieldName]: {
				$: [
					Source.Reddit_Rest,
				],
				limit,
			},
		},
	)

	const comments = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.RedditComment>[] = merged[fieldName] ?? []
			return (
				rows
					.toSorted((a, b) => (
						b[EntityMetaKey.IdKey].localeCompare(a[EntityMetaKey.IdKey])
					))
					.map((comment) => ({
						...comment[EntityMetaKey.Id],
						sortKey: comment[EntityMetaKey.IdKey],
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
		entityType={EntityType.RedditComment}
		{href}
		{id}
		{title}
		bind:open
		resource={comments}
		placeholderText="Loading comment thread…"
		getKey={(row) => row.fullname}
		getSortValue={(row) => row.sortKey}
		placeholderKeys={new SvelteSet<string>()}
	>
		{#snippet TypeAnnotationTooltip()}
						<p>
							Top-level comments are direct replies to a Reddit submission, ordered for this thread listing.
						</p>
						<p>
							They are specific to Reddit’s data model—not Farcaster feeds or in-app multiplayer chat.
						</p>
		{/snippet}
		{#snippet Empty()}
			<p data-text="muted">
				No comments yet.
			</p>
		{/snippet}

		{#snippet Item({
			item: row,
		})}
			{#if row}
				<RedditCommentView
					entityId={{ fullname: row.fullname }}
					href={resolve('/(social)/reddit/comment/[fullname]', {
						fullname: encodeURIComponent(row.fullname),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
