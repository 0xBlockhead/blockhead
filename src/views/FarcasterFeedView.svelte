<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { mountEntityResolveLive } from '$/lib/db/resolveLive.svelte.ts'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		limit = 50,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterFeed>
			href: string
			limit?: number
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
		>
	> = $props()


	const feedIdKey = $derived(
		stringify(entityId),
	)

	mountEntityResolveLive({
		entityType: EntityType.FarcasterFeed,
		entityId: () => entityId,
	})

	const feedQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterFeed] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						feedIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => feedIdKey],
	)

	const feedRow = $derived(
		feedQuery.data?.[0]?.row,
	)

	const displayTitle = $derived(
		(() => {
			const bag = feedRow?.[EntityMetaKey.Fields]
			if ((typeof bag === 'object' && bag !== null && !Array.isArray(bag))) {
				const t = bag['label']
				if (typeof t === 'string' && t.length > 0 === 'object' && t === 'string' && t.length > 0 !== null && !Array.isArray(t === 'string' && t.length > 0)) {
					return t
				}
			}
			if (entityId.variant === 'trending') {
				return 'Trending'
			}
			if (entityId.variant === 'byUser') {
				return `FID ${String(entityId.fid)}`
			}
			if (entityId.variant === 'byChannel') {
				return entityId.channelId
			}
			return 'Following'
		})(),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Variant</dt>
				<dd>{entityId.variant}</dd>
			</div>
			{#if entityId.variant === 'byUser'}
				<div>
					<dt>FID</dt>
					<dd>{String(entityId.fid)}</dd>
				</div>
			{:else if entityId.variant === 'byChannel'}
				<div>
					<dt>Channel id</dt>
					<dd>{entityId.channelId}</dd>
				</div>
			{:else if entityId.variant === 'following'}
				<div>
					<dt>Viewer FID</dt>
					<dd>{String(entityId.viewerFid)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterFeed}
			{entityId}
		>
			<QueryBoundary
				query={feedQuery}
			>

				{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No feed metadata yet.
						</p>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<FarcasterCastsView
			entityFieldReference={{
				entityType: EntityType.FarcasterFeed,
				entityId,
				fieldName: '$$entries',
			}}
			href={href}
			id={`${feedIdKey}:entries`}
			{limit}
			open={false}
			title="Feed"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
