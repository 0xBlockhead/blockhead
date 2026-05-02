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
		title = 'Subreddits',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.RedditSubreddit>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const subredditsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					subredditFieldRow: entityFieldCollections[EntityType.RedditNetwork]['$$redditSubreddits']!,
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
				.select(({ subredditFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						subredditFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
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
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditSubreddit}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		typeof row[EntityMetaKey.Id] === 'object'
		&& row[EntityMetaKey.Id] !== undefined
		&& 'name' in row[EntityMetaKey.Id]
		&& typeof row[EntityMetaKey.Id].name === 'string' ?
			row[EntityMetaKey.Id].name
		:	''
	)}
	items={new SvelteSet(subredditsQuery.data ?? [])}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={subredditsQuery}
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
			{#if typeof subredditId === 'object' && subredditId !== undefined && 'name' in subredditId && typeof subredditId.name === 'string'}
				<RedditSubredditView
					entityId={{ name: subredditId.name }}
					href={resolve('/(social)/reddit/r/[name]', {
						name: encodeURIComponent(subredditId.name),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
