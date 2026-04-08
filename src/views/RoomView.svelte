<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
			title?: string
			href: string
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
			| 'Summary'
		>
	> = $props()


	const roomIdKey = $derived(
		stringify(entityId),
	)

	const roomQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadRoom] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						roomIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => roomIdKey],
	)

	const roomRow = $derived(
		roomQuery.data?.[0]?.row,
	)

	const roomPrimitives = $derived(
		(() => {
			const bag = roomRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object' || Array.isArray(bag)) return null
			const b = bag as Record<string, unknown>
			const createdAt = b.createdAt
			const createdBy = b.createdBy
			const name = b.name
			return {
				createdAt: (
					typeof createdAt === 'number' && Number.isFinite(createdAt) ?
						createdAt
					:
						undefined
				),
				createdBy: (
					typeof createdBy === 'string' && createdBy.length ?
						createdBy
					:
						undefined
				),
				name: (
					typeof name === 'string' && name.length ?
						name
					:
						undefined
				),
			}
		})(),
	)

	const displayTitle = $derived(
		titleProp
		?? roomPrimitives?.name
		?? entityId.id,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Room id</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if roomPrimitives?.name != null}
				<div>
					<dt>Name</dt>
					<dd>{roomPrimitives.name}</dd>
				</div>
			{/if}
			{#if roomPrimitives?.createdBy != null}
				<div>
					<dt>Created by</dt>
					<dd>{roomPrimitives.createdBy}</dd>
				</div>
			{/if}
			{#if roomPrimitives?.createdAt != null}
				<div>
					<dt>Created at</dt>
					<dd>{String(roomPrimitives.createdAt)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoom}
				{entityId}
			>
				<QueryBoundary
					query={roomQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No room row in collections yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Room id</dt>
								<dd>{entityId.id}</dd>
							</div>
							<div>
								<dt>Name</dt>
								<dd>{roomPrimitives?.name ?? '–'}</dd>
							</div>
							<div>
								<dt>Created by</dt>
								<dd>{roomPrimitives?.createdBy ?? '–'}</dd>
							</div>
							<div>
								<dt>Created at</dt>
								<dd>{roomPrimitives?.createdAt != null ? String(roomPrimitives.createdAt) : '–'}</dd>
							</div>
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
