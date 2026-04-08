<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityViewProps } from '$/typescript/EntityViewProps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			EntityViewProps,
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

	const roomField = $derived(
		(() => {
			const bag = roomRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				createdAt: typeof b.createdAt === 'number' && Number.isFinite(b.createdAt) ? b.createdAt : undefined,
				createdBy: typeof b.createdBy === 'string' && b.createdBy.length ? b.createdBy : undefined,
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		roomField?.name ?? entityId.id,
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
			{#if roomField?.name != null}
				<div>
					<dt>Name</dt>
					<dd>{roomField.name}</dd>
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
							{#if roomField?.createdAt != null}
								<div>
									<dt>Created at</dt>
									<dd>{new Date(roomField.createdAt).toISOString()}</dd>
								</div>
							{/if}
							{#if roomField?.createdBy != null}
								<div>
									<dt>Created by</dt>
									<dd>{roomField.createdBy}</dd>
								</div>
							{/if}
							{#if roomField?.name != null}
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
