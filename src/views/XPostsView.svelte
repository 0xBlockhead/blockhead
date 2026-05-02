<script lang="ts">
	// Types/constants
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.XPost>
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
						Source.X_Rest,
					)
				))
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
		typeof row[EntityMetaKey.Id] === 'object'
		&& row[EntityMetaKey.Id] !== undefined
		&& 'id' in row[EntityMetaKey.Id]
		&& typeof row[EntityMetaKey.Id].id === 'string' ?
			row[EntityMetaKey.Id].id
		:	''
	)}
	items={new SvelteSet(postsQuery.data ?? [])}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={postsQuery}
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
			{#if typeof postId === 'object' && postId !== undefined && 'id' in postId && typeof postId.id === 'string'}
				<XPostView
					entityId={{ id: postId.id }}
					href={resolve('/(social)/x/post/[postId]', {
						postId: encodeURIComponent(postId.id),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
