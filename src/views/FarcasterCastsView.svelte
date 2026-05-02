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
		id = 'casts',
		href = '/farcaster/feed',
		title = 'Casts',
		limit = 25,
		open = $bindable(true),
		entityFieldReference,
	}: {
		id?: string
		href?: string
		title?: string
		limit?: number
		open?: boolean
		entityFieldReference: EntityFieldReference<typeof EntityType.FarcasterCast>
	} = $props()

	const farcasterCastListSource = $derived(
		(
			typeof import.meta.env.PUBLIC_NEYNAR_API_KEY === 'string'
			&& import.meta.env.PUBLIC_NEYNAR_API_KEY.trim() !== ''
		) ?
			Source.Neynar_Rest
		:	Source.Snapchain_Rest,
	)

	const castsQuery = useLiveQuery(
		(queryBuilder) => {
			const castFieldCollection = (
				entityFieldCollections[entityFieldReference.entityType]!
			)[entityFieldReference.fieldName]!
			const castEntityCollection = (
				entityCollectionByEntityType[EntityType.FarcasterCast]
			)!

			return queryBuilder
				.from({ castFieldRow: castFieldCollection })
				.where(({ castFieldRow }) => (
					eq(
						castFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ castFieldRow }) => (
					eq(
						castFieldRow[EntityMetaKey.Source],
						farcasterCastListSource,
					)
				))
				.innerJoin(
					{ cast: castEntityCollection },
					({ castFieldRow, cast }) => (
						eq(
							// @ts-expect-error field row Value id key joins to cast collection
							castFieldRow[EntityMetaKey.Value]![EntityMetaKey.IdKey],
							cast[EntityMetaKey.IdKey],
						)
					),
				)
				.where(({ cast }) => (
					eq(
						cast[EntityMetaKey.Source],
						farcasterCastListSource,
					)
				))
				.orderBy(({ cast }) => coalesce(cast.timestamp, 0), 'desc')
				.orderBy(({ cast }) => cast[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ castFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error field row Value holds the cast entity id
						castFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
			() => farcasterCastListSource,
		],
	)

	const castItems = $derived.by(() => {
		const items: ((EntityId<typeof schema, EntityType.FarcasterCast>) & { order: number })[] = []
		for (const [order, row] of (castsQuery.data ?? []).entries()) {
			const castId = (
				row[EntityMetaKey.Id] as EntityId<typeof schema, EntityType.FarcasterCast>
			)
			items.push({
				...castId,
				order,
			})
		}
		return new SvelteSet(items)
	})

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterCast}
	{id}
	{href}
	{title}
	bind:open
	query={castsQuery}
	items={castItems}
	getKey={(row) => `${row.fid}:${row.hash}`}
	getSortValue={(row) => row.order}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet Empty()}
		<p data-text="muted">
			No casts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<FarcasterCastView
				entityId={{
					fid: item.fid,
					hash: item.hash,
				}}
				href={resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
					fid: String(item.fid),
					hash: String(item.hash),
				})}
				layout={EntityLayout.Summary}
				open={false}
				variant="feed"
			/>
		{/if}
	{/snippet}
</EntitiesList>
