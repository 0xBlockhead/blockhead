<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		EntityFieldType,
		type EntityFieldDefinition,
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

	const bridgePrimitiveFieldNames = $derived(
		new Set(
			entityDefinitionByType[EntityType.BridgeTransaction].fields.flatMap((d: EntityFieldDefinition) => (
				d.type === EntityFieldType.Primitive ?
					[d.name]
				:	[]
			)),
		),
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
		<dl>
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
					{@const fieldsRaw = bridgeRow[EntityMetaKey.Fields]}
					<dl>
						{#if typeof fieldsRaw === 'object' && fieldsRaw !== null && !Array.isArray(fieldsRaw)}
							{#each Object.entries(fieldsRaw) as [name, value] (name)}
								{#if bridgePrimitiveFieldNames.has(name) && value !== undefined}
									<div>
										<dt>{name}</dt>
										<dd>{String(value)}</dd>
									</div>
								{/if}
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
