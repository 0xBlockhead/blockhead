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
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.XPost>
		href: string
		id: string
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
						Source.X_Rest,
					)
				))
				.select(({ postFieldRow }) => (
					{ value: postFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.XPost}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].id
	)}
	items={postsQuery.data?.map(({ value }) => value) ?? []}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: postsQuery.data?.map(({ value }) => value) ?? [],
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
			No X posts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			{@const postId = item[EntityMetaKey.Id]}
			<XPostView
				entityId={{ id: postId.id }}
				href={resolve('/(social)/x/post/[postId]', {
					postId: encodeURIComponent(postId.id),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
