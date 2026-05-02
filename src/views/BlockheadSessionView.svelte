<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'


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
			if (bag === undefined || typeof bag !== 'object' || Array.isArray(bag)) return null
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
				statusRaw !== undefined
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

	const sessionTs = $derived(
		sessionPrimitives?.updatedAt
		?? sessionPrimitives?.createdAt
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSession}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={sessionPrimitives?.name ?? entityId.id}
>
	{#snippet Content()}
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
			{#if sessionPrimitives?.status !== undefined}
				<div>
					<dt>Status</dt>
					<dd>{sessionPrimitives.status}</dd>
				</div>
			{/if}
			{#if sessionTs !== undefined && typeof sessionTs === 'number' && Number.isFinite(sessionTs)}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={sessionTs}
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
				entityType={EntityType.BlockheadSession}
				{entityId}
			>
				<QueryBoundary
					query={sessionQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No session data for this id yet.
						</p>
					{:else}
						<dl>
							{#if sessionPrimitives?.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{sessionPrimitives.name}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{sessionPrimitives.status}</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.createdAt !== undefined && typeof sessionPrimitives.createdAt === 'number' && Number.isFinite(sessionPrimitives.createdAt)}
								<div>
									<dt>Created</dt>
									<dd>
										<Timestamp
											timestamp={sessionPrimitives.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.updatedAt !== undefined && typeof sessionPrimitives.updatedAt === 'number' && Number.isFinite(sessionPrimitives.updatedAt)}
								<div>
									<dt>Updated</dt>
									<dd>
										<Timestamp
											timestamp={sessionPrimitives.updatedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.lockedAt !== undefined && typeof sessionPrimitives.lockedAt === 'number' && Number.isFinite(sessionPrimitives.lockedAt)}
								<div>
									<dt>Locked</dt>
									<dd>
										<Timestamp
											timestamp={sessionPrimitives.lockedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if sessionPrimitives?.simulationCount !== undefined}
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
