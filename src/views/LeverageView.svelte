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
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Leverage>
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

	const leverageIdKey = $derived(
		stringify(entityId),
	)

	const leverageQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Leverage] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						leverageIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => leverageIdKey],
	)

	const leverageRow = $derived(
		leverageQuery.data?.[0]?.row,
	)

	const leverageField = $derived(
		(() => {
			const bag = leverageRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				tickLower: typeof b.tickLower === 'number' ? b.tickLower : undefined,
				tickUpper: typeof b.tickUpper === 'number' ? b.tickUpper : undefined,
				liquidity: typeof b.liquidity === 'bigint' ? b.liquidity : undefined,
				token0Owed: typeof b.token0Owed === 'bigint' ? b.token0Owed : undefined,
				token1Owed: typeof b.token1Owed === 'bigint' ? b.token1Owed : undefined,
				tokenId: typeof b.tokenId === 'bigint' ? b.tokenId : undefined,
				origin: typeof b.origin === 'string' && b.origin.length ? b.origin : undefined,
				createdAtTimestamp: typeof b.createdAtTimestamp === 'number' ? b.createdAtTimestamp : undefined,
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
	entityType={EntityType.Leverage}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={entityId.id}
>
	{#snippet Content()}
		{#if leverageField?.createdAtTimestamp !== undefined && typeof leverageField.createdAtTimestamp === 'number' && Number.isFinite(leverageField.createdAtTimestamp)}
			<dl>
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={leverageField.createdAtTimestamp}
							format={TimestampFormat.Both}
						/>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.Leverage}
				{entityId}
			>
				<QueryBoundary
					query={leverageQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No leverage data for this id yet.
						</p>
					{:else}
						<dl>
							{#if leverageField?.tickLower !== undefined}
								<div>
									<dt>Tick lower</dt>
									<dd>{String(leverageField.tickLower)}</dd>
								</div>
							{/if}
							{#if leverageField?.tickUpper !== undefined}
								<div>
									<dt>Tick upper</dt>
									<dd>{String(leverageField.tickUpper)}</dd>
								</div>
							{/if}
							{#if leverageField?.liquidity !== undefined}
								<div>
									<dt>Liquidity</dt>
									<dd>{String(leverageField.liquidity)}</dd>
								</div>
							{/if}
							{#if leverageField?.token0Owed !== undefined}
								<div>
									<dt>Token0 owed</dt>
									<dd>{String(leverageField.token0Owed)}</dd>
								</div>
							{/if}
							{#if leverageField?.token1Owed !== undefined}
								<div>
									<dt>Token1 owed</dt>
									<dd>{String(leverageField.token1Owed)}</dd>
								</div>
							{/if}
							{#if leverageField?.tokenId !== undefined}
								<div>
									<dt>Token id</dt>
									<dd>{String(leverageField.tokenId)}</dd>
								</div>
							{/if}
							{#if leverageField?.origin !== undefined}
								<div>
									<dt>Origin</dt>
									<dd>{leverageField.origin}</dd>
								</div>
							{/if}
							{#if leverageField?.createdAtTimestamp !== undefined && typeof leverageField.createdAtTimestamp === 'number' && Number.isFinite(leverageField.createdAtTimestamp)}
								<div>
									<dt>Created at (timestamp)</dt>
									<dd>
										<Timestamp
											timestamp={leverageField.createdAtTimestamp}
											format={TimestampFormat.Both}
										/>
									</dd>
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
