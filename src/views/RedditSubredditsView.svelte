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
		title = 'Subreddits',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditSubreddit>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const subredditsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					subredditFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
				.where(({ subredditFieldRow }) => (
					eq(
						subredditFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ subredditFieldRow }) => (
					eq(
						subredditFieldRow[EntityMetaKey.Source],
						Source.Reddit_Rest,
					)
				))
				.select(({ subredditFieldRow }) => (
					{ value: subredditFieldRow[EntityMetaKey.Value] }
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
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditSubreddit}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].name
	)}
	items={subredditsQuery.data?.map(({ value }) => value) ?? []}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: subredditsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: subredditsQuery.isLoading,
		isError: subredditsQuery.isError,
		isReady: subredditsQuery.isReady,
		error: subredditsQuery.error,
		status: subredditsQuery.status,
	}}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Reddit communities to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			{@const subredditId = item[EntityMetaKey.Id]}
			<RedditSubredditView
				entityId={{ name: subredditId.name }}
				href={resolve('/(social)/reddit/r/[name]', {
					name: encodeURIComponent(subredditId.name),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
