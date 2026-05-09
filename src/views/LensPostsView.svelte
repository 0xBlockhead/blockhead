<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { coalesce, eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensPost>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	const postsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					postFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
				.where(({ postFieldRow }) => (
					eq(
						postFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ postFieldRow }) => (
					eq(
						postFieldRow[EntityMetaKey.Source],
						Source.Lens_Graphql,
					)
				))
				.innerJoin(
					{ post: entityCollectionByEntityType[EntityType.LensPost] },
					({ postFieldRow, post }) => (
						eq(
							postFieldRow[EntityMetaKey.Value][EntityMetaKey.IdKey],
							post[EntityMetaKey.IdKey],
						)
					),
				)
				.where(({ post }) => (
					eq(
						post[EntityMetaKey.Source],
						Source.Lens_Graphql,
					)
				))
				.orderBy(({ post }) => coalesce(post.timestamp, 0), 'desc')
				.orderBy(({ post }) => post[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ postFieldRow }) => (
					{ value: postFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
		],
	)

	const postItems = $derived(
		(postsQuery.data ?? []).map(({ value: post }, order) => ({
			...post[EntityMetaKey.Id],
			order,
		})),
	)

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}
	{href}
	{id}
	getKey={(row) => row.id}
	getSortValue={(row) => row.order}
	items={postItems}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: postItems,
		isLoading: postsQuery.isLoading,
		isError: postsQuery.isError,
		isReady: postsQuery.isReady,
		error: postsQuery.error,
		status: postsQuery.status,
	}}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Lens posts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<LensPostView
				entityId={{ id: item.id }}
				href={resolve('/(social)/lens/post/[postId]', {
					postId: encodeURIComponent(item.id),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
