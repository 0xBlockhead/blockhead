<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema, type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
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
		entityFieldReference: EntityFieldReference<typeof EntityType.FarcasterFeed>
	} = $props()


	// (Derived)
	const feedsQuery = useLiveQuery(
		(queryBuilder) => {
			const pk = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({ $$feeds: entityFieldCollections[EntityType.FarcasterNetwork]['$$feeds']! })
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
						{
							[EntityMetaKey.Id]: (
								$$feeds[EntityMetaKey.Value][EntityMetaKey.Id]
							),
						}
					))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type Row = (NonNullable<typeof feedsQuery.data>)[number]


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
	query={feedsQuery}
	items={new SvelteSet(feedsQuery.data ?? [])}
	getKey={(row) => stringify(
		row?.[EntityMetaKey.Id] ?? {},
	)}
	getSortValue={(row) => stringify(
		row?.[EntityMetaKey.Id] ?? {},
	)}
	placeholderKeys={new SvelteSet<string | number>()}
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
			{@const feedId = (row as Row)[EntityMetaKey.Id]}
			<FarcasterFeedView
				entityId={feedId}
				href={farcasterFeedSummaryHref(feedId)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
