<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		EntityFieldType,
		EntityMetaKey,
	} from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Transaction',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BridgeTransaction>
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

	const bridgeIdKey = $derived(
		stringify(entityId),
	)

	const bridgeQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BridgeTransaction] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						bridgeIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => bridgeIdKey],
	)

	const bridgeRow = $derived(
		(
			bridgeQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
			)?.row
			?? bridgeQuery.data?.[0]?.row
		)
	)

	const bridgeFieldBag = $derived(
		(() => {
			const bag = bridgeRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const out: Record<string, string> = {}
			for (const def of entityDefinitionByType[EntityType.BridgeTransaction].fields) {
				if (def.type !== EntityFieldType.Primitive) continue
				const v = b[def.name]
				if (v === undefined) continue
				out[def.name] = String(v)
			}
			return out
		})(),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransaction}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Source tx</dt>
				<dd>
					<TruncatedValue
						value={entityId.$sourceTx.txHash}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>
			{#if entityId.createdAt !== undefined && typeof entityId.createdAt === 'number' && Number.isFinite(entityId.createdAt)}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={entityId.createdAt}
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
		<EntityDetails
			entityType={EntityType.BridgeTransaction}
			{entityId}
		>
			<QueryBoundary
				query={bridgeQuery}
			>

				{#snippet children(rows)}
				{@const bridgeRow = (
					rows?.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
					)?.row
					?? rows?.[0]?.row
				)}
				{#if bridgeRow === undefined}
					<p data-text="muted">
						No bridge transaction data yet.
					</p>
				{:else}
					<dl>
						{#if bridgeFieldBag !== undefined}
							{#each Object.entries(bridgeFieldBag) as [name, value] (name)}
								<div>
									<dt>{name}</dt>
									<dd>{value}</dd>
								</div>
							{/each}
						{/if}
						{#if entityId.createdAt !== undefined && typeof entityId.createdAt === 'number' && Number.isFinite(entityId.createdAt)}
							<div>
								<dt>Timestamp</dt>
								<dd>
									<Timestamp
										timestamp={entityId.createdAt}
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

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
