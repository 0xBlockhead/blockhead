<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'

	const farcasterFeedSummaryHref = (id: EntityId<typeof schema, EntityType.FarcasterFeed>) => (
		id.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: id.variant === 'byUser' ?
			resolve(`/farcaster/feed/user/${String(id.fid)}`)
		: id.variant === 'byChannel' ?
			resolve(`/farcaster/feed/channel/${encodeURIComponent(id.channelId)}`)
		:
			resolve('/farcaster/feed')
	)


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		id = 'farcaster-feeds',
		href = resolve('/farcaster/feed'),
		title = 'Feeds',
		open = $bindable(true),
		entityFieldReference,
	}: {
		id?: string
		href?: string
		title?: string
		open?: boolean
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterFeed>
	} = $props()


	// (Derived)
	const feedsQuery = useLiveQuery(
		(queryBuilder) => {
			const pk = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({ $$feeds: entityFieldCollections[EntityType.FarcasterNetwork]['$$feeds'] })
					.where(({ $$feeds }) => (
						eq(
							$$feeds[EntityMetaKey.ParentIdKey],
							pk,
						)
					))
					.where(({ $$feeds }) => (
						eq(
							$$feeds[EntityMetaKey.Source],
							Source.Farcaster_Rest,
						)
					))
					.select(({ $$feeds }) => (
						{ value: $$feeds[EntityMetaKey.Value] }
					))
					.distinct()
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterFeed}
	{id}
	{href}
	{title}
	bind:open
	items={feedsQuery.data?.map(({ value }) => value) ?? []}
	getKey={(row) => stringify(
		row[EntityMetaKey.Id],
	)}
	getSortValue={(row) => stringify(
		row[EntityMetaKey.Id],
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	query={{
		data: feedsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: feedsQuery.isLoading,
		isError: feedsQuery.isError,
		isReady: feedsQuery.isReady,
		error: feedsQuery.error,
		status: feedsQuery.status,
	}}
>
	{#snippet Empty()}
		<p data-text="muted">
			No feed entries yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const feedId = row[EntityMetaKey.Id]}
			<FarcasterFeedView
				entityId={feedId}
				href={farcasterFeedSummaryHref(feedId)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
