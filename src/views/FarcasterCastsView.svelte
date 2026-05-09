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
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterCast>
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
				entityFieldCollectionForReference(
					entityFieldCollections,
					entityFieldReference,
				)
			)

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
				.orderBy(({ castFieldRow }) => (
					castFieldRow[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(limit)
				.select(({ castFieldRow }) => (
					{ value: castFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
			() => farcasterCastListSource,
		],
	)

	const castItems = $derived(
		(castsQuery.data ?? []).map(({ value: cast }, order) => ({
			...cast[EntityMetaKey.Id],
			order,
		})),
	)

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
	items={castItems}
	getKey={(row) => `${row.fid}:${row.hash}`}
	getSortValue={(row) => row.order}
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: castItems,
		isLoading: castsQuery.isLoading,
		isError: castsQuery.isError,
		isReady: castsQuery.isReady,
		error: castsQuery.error,
		status: castsQuery.status,
	}}
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
