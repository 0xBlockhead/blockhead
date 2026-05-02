<script lang="ts">
	// Types/constants
	import { type EntityFieldReference, type EntityId, schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
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


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.AtprotoPost>
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
						entityFieldCollections[entityFieldReference.entityType]!
					)[entityFieldReference.fieldName]!,
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
						Source.Atproto_Xrpc,
					)
				))
				.innerJoin(
					{ post: entityCollectionByEntityType[EntityType.AtprotoPost] },
					({ postFieldRow, post }) => (
						eq(
							// @ts-expect-error entity field row stores target id key
							postFieldRow[EntityMetaKey.Value]![EntityMetaKey.IdKey],
							post[EntityMetaKey.IdKey],
						)
					),
				)
				.where(({ post }) => (
					eq(
						post[EntityMetaKey.Source],
						Source.Atproto_Xrpc,
					)
				))
				.orderBy(({ post }) => coalesce(post.timestamp, 0), 'desc')
				.orderBy(({ post }) => post[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ postFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						postFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
		],
	)

	const postItems = $derived.by(() => (
		new SvelteSet(
			(postsQuery.data ?? []).flatMap((row, order) => {
				const postId = row[EntityMetaKey.Id]
				return (
					postId !== undefined
					&& typeof postId === 'object'
					&& 'uri' in postId
					&& typeof postId.uri === 'string'
				) ?
					[
						{
							...(postId as EntityId<typeof schema, EntityType.AtprotoPost>),
							order,
						},
					]
				:	[]
			}),
		)
	))


	// Components
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{href}
	{id}
	getKey={(row) => row.uri}
	getSortValue={(row) => row.order}
	items={postItems}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={postsQuery}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No AT Protocol posts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<AtprotoPostView
				entityId={{ uri: item.uri }}
				href={resolve('/(social)/atproto/post/[uri]', {
					uri: encodeURIComponent(item.uri),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
