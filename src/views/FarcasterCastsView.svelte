<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { coalesce, eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/collections/$collections.ts'

	type CastListRow = {
		fid: number
		hash: string
		order: number
	}

	const isFarcasterCastEntityId = (value: unknown): value is { fid: number, hash: string } => (
		typeof value === 'object'
		&& value != null
		&& 'fid' in value
		&& typeof (value as { fid: unknown }).fid === 'number'
		&& 'hash' in value
		&& typeof (value as { hash: unknown }).hash === 'string'
	)

	const castRowSortKey = (row: CastListRow) => (
		row.order
	)

	const castRowKey = (row: CastListRow) => (
		`${row.fid}:${row.hash}`
	)

	type CastParentProps =
		| {
			parentEntityType: EntityType.FarcasterNetwork
			parentEntityId: EntityId<typeof schema, EntityType.FarcasterNetwork>
		}
		| {
			parentEntityType: EntityType.FarcasterUser
			parentEntityId: EntityId<typeof schema, EntityType.FarcasterUser>
		}
		| {
			parentEntityType: EntityType.FarcasterChannel
			parentEntityId: EntityId<typeof schema, EntityType.FarcasterChannel>
		}

	let {
		id = 'casts',
		href = '/farcaster/feed',
		title = 'Casts',
		limit = 25,
		open = $bindable(true),
		parentEntityType,
		parentEntityId,
	}: {
		id?: string
		href?: string
		title?: string
		limit?: number
		open?: boolean
	} & CastParentProps = $props()

	const parentIdKey = $derived(
		stringify(parentEntityId),
	)

	const farcasterCastListSource = $derived(
		(
			typeof import.meta.env.PUBLIC_NEYNAR_API_KEY === 'string'
			&& import.meta.env.PUBLIC_NEYNAR_API_KEY.trim() !== ''
		) ?
			Source.Neynar
		:	Source.Snapchain,
	)

	const isHexCastHash = (hash: string): hash is `0x${string}` => (
		hash.startsWith('0x')
	)

	const castsQuery = useLiveQuery(
		(queryBuilder) => {
			const castFieldCollection = (
				parentEntityType === EntityType.FarcasterNetwork ?
					entityFieldCollections[EntityType.FarcasterNetwork]['$$casts']
				: parentEntityType === EntityType.FarcasterUser ?
					entityFieldCollections[EntityType.FarcasterUser]['$$casts']
				:
					entityFieldCollections[EntityType.FarcasterChannel]['$$casts']
			)!
			const castEntityCollection = (
				entityCollectionByEntityType[EntityType.FarcasterCast]
			)!

			return queryBuilder
				.from({ castFieldRow: castFieldCollection })
				.where(({ castFieldRow }) => (
					eq(
						castFieldRow[EntityMetaKey.ParentIdKey],
						parentIdKey,
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
							castFieldRow[EntityMetaKey.Value][EntityMetaKey.IdKey],
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
				.orderBy(({ cast }) => (
					// @ts-expect-error FarcasterCast rows include `timestamp` (spread from `#fields` in $collections); Ref typings omit it.
					coalesce(cast.timestamp, 0)
				), 'desc')
				.orderBy(({ cast }) => cast[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ castFieldRow }) => ({
					[EntityMetaKey.Id]: castFieldRow[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		},
		[
			() => parentEntityType,
			() => parentIdKey,
			() => limit,
			() => farcasterCastListSource,
		],
	)

	const castItems = $derived.by(() => {
		const items: CastListRow[] = []

		for (const [order, row] of (castsQuery.data ?? []).entries()) {
			const castId = row[EntityMetaKey.Id]

			if (isFarcasterCastEntityId(castId)) {
				items.push({
					fid: castId.fid,
					hash: castId.hash,
					order,
				})
			}
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
	getKey={castRowKey}
	getSortValue={castRowSortKey}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet Empty()}
		<p data-text="muted">
			No casts in collections yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item && item.fid >= 0 && isHexCastHash(item.hash)}
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
