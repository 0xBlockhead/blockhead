<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'


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
			entityId: EntityId<typeof schema, EntityType.BlockheadSession>
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


	const sessionIdKey = $derived(
		stringify(entityId),
	)

	const sessionQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadSession] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						sessionIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => sessionIdKey],
	)

	const sessionRow = $derived(
		sessionQuery.data?.[0]?.row,
	)

	const sessionPrimitives = $derived(
		(() => {
			const bag = sessionRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object' || Array.isArray(bag)) return null
			const b = bag as Record<string, unknown>
			const str = (key: string) => (
				typeof b[key] === 'string' && (b[key] as string).length ?
					(b[key] as string)
				:	undefined
			)
			const num = (key: string) => (
				typeof b[key] === 'number' && Number.isFinite(b[key] as number) ?
					(b[key] as number)
				:	undefined
			)
			const statusRaw = str('status')
			const status = (
				statusRaw != null
				&& (
					Object.values(BlockheadSessionStatus) as string[]
				).includes(statusRaw) ?
					statusRaw
				:	undefined
			)
			return {
				name: str('name'),
				status,
				createdAt: num('createdAt'),
				updatedAt: num('updatedAt'),
				lockedAt: num('lockedAt'),
				simulationCount: num('simulationCount'),
			}
		})(),
	)

	const displayTitle = $derived(
		sessionPrimitives?.name ?? entityId.id,
	)

	const isoFromMs = (ms: number) => (
		new Date(ms).toISOString()
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Session id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
			{#if sessionPrimitives?.status != null}
				<div>
					<dt>Status</dt>
					<dd>{sessionPrimitives.status}</dd>
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
				entityType={EntityType.BlockheadSession}
				{entityId}
			>
				<QueryBoundary
					query={sessionQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No session row in collections yet (no resolver for this session).
						</p>
					{:else}
						<dl>
							{#if sessionPrimitives?.name != null}
								<div>
									<dt>Name</dt>
									<dd>{sessionPrimitives.name}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.status != null}
								<div>
									<dt>Status</dt>
									<dd>{sessionPrimitives.status}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.createdAt != null}
								<div>
									<dt>Created</dt>
									<dd>{isoFromMs(sessionPrimitives.createdAt)}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.updatedAt != null}
								<div>
									<dt>Updated</dt>
									<dd>{isoFromMs(sessionPrimitives.updatedAt)}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.lockedAt != null}
								<div>
									<dt>Locked</dt>
									<dd>{isoFromMs(sessionPrimitives.lockedAt)}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.simulationCount != null}
								<div>
									<dt>Simulation count</dt>
									<dd>{String(sessionPrimitives.simulationCount)}</dd>
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
