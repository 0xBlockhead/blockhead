<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
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

	const roomField = $derived(
		(() => {
			const bag = roomRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				createdAt: typeof b.createdAt === 'number' && Number.isFinite(b.createdAt) ? b.createdAt : undefined,
				createdBy: typeof b.createdBy === 'string' && b.createdBy.length ? b.createdBy : undefined,
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
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
	title={roomField?.name ?? entityId.id}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Room id</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if roomField?.name !== undefined}
				<div>
					<dt>Name</dt>
					<dd>{roomField.name}</dd>
				</div>
			{/if}
			{#if roomField?.createdAt !== undefined && typeof roomField.createdAt === 'number' && Number.isFinite(roomField.createdAt)}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={roomField.createdAt}
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
							{#if roomField?.createdAt !== undefined && typeof roomField.createdAt === 'number' && Number.isFinite(roomField.createdAt)}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={roomField.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if roomField?.createdBy !== undefined}
								<div>
									<dt>Created by</dt>
									<dd>{roomField.createdBy}</dd>
								</div>
							{/if}
							{#if roomField?.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{roomField.name}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
