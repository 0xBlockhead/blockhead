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
		limit = 50,
		open = $bindable(true),
		title = 'Comments',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.RedditComment>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	const commentsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					commentFieldRow: (
						entityFieldCollections[entityFieldReference.entityType]!
					)[entityFieldReference.fieldName]!,
				})
				.where(({ commentFieldRow }) => (
					eq(
						commentFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ commentFieldRow }) => (
					eq(
						commentFieldRow[EntityMetaKey.Source],
						Source.Reddit_Rest,
					)
				))
				.innerJoin(
					{ comment: entityCollectionByEntityType[EntityType.RedditComment] },
					({ commentFieldRow, comment }) => (
						eq(
							// @ts-expect-error entity field row stores target id key
							commentFieldRow[EntityMetaKey.Value]![EntityMetaKey.IdKey],
							comment[EntityMetaKey.IdKey],
						)
					),
				)
				.where(({ comment }) => (
					eq(
						comment[EntityMetaKey.Source],
						Source.Reddit_Rest,
					)
				))
				.orderBy(({ comment }) => coalesce(comment.timestamp, 0), 'desc')
				.orderBy(({ comment }) => comment[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ commentFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						commentFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
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

	const commentItems = $derived.by(() => (
		new SvelteSet(
			(commentsQuery.data ?? []).flatMap((row, order) => {
				const commentId = row[EntityMetaKey.Id]
				return (
					commentId !== undefined
					&& typeof commentId === 'object'
					&& 'fullname' in commentId
					&& typeof commentId.fullname === 'string'
				) ?
					[
						{
							...(commentId as EntityId<typeof schema, EntityType.RedditComment>),
							order,
						},
					]
				:	[]
			}),
		)
	))


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditComment}
	{href}
	{id}
	getKey={(row) => row.fullname}
	getSortValue={(row) => row.order}
	items={commentItems}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={commentsQuery}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Reddit comments to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<RedditCommentView
				entityId={{ fullname: item.fullname }}
				href={resolve('/(social)/reddit/comment/[fullname]', {
					fullname: encodeURIComponent(item.fullname),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
