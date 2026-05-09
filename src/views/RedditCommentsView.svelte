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
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'
	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 50,
		open = $bindable(true),
		title = 'Comments',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditComment>
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
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
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
				.orderBy(({ commentFieldRow }) => (
					commentFieldRow[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(limit)
				.select(({ commentFieldRow }) => (
					{ value: commentFieldRow[EntityMetaKey.Value] }
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

	const commentItems = $derived(
		(commentsQuery.data ?? []).map(({ value: comment }, order) => ({
			...comment[EntityMetaKey.Id],
			order,
		})),
	)

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
	query={{
		data: commentItems,
		isLoading: commentsQuery.isLoading,
		isError: commentsQuery.isError,
		isReady: commentsQuery.isReady,
		error: commentsQuery.error,
		status: commentsQuery.status,
	}}
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
