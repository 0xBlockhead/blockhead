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

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
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

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={titleProp ?? roomPrimitives?.name ?? entityId.id}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Room id</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if roomPrimitives?.name !== undefined}
				<div>
					<dt>Name</dt>
					<dd>{roomPrimitives.name}</dd>
				</div>
			{/if}
			{#if roomPrimitives?.createdBy !== undefined}
				<div>
					<dt>Created by</dt>
					<dd>{roomPrimitives.createdBy}</dd>
				</div>
			{/if}
			{#if roomPrimitives?.createdAt !== undefined && typeof roomPrimitives.createdAt === 'number' && Number.isFinite(roomPrimitives.createdAt)}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={roomPrimitives.createdAt}
							format={TimestampFormat.Both}
						/>
					</dd>
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
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No room data yet.
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
								<dd>
									{#if roomPrimitives?.createdAt !== undefined && typeof roomPrimitives.createdAt === 'number' && Number.isFinite(roomPrimitives.createdAt)}
										<Timestamp
											timestamp={roomPrimitives.createdAt}
											format={TimestampFormat.Both}
										/>
									{:else}
										–
									{/if}
								</dd>
							</div>
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
