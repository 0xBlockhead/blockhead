<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { type EntityId, schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href = entityId.url,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NetworkBridge>
			href?: string
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
				.from({ bridgeRow: entityCollectionByEntityType[EntityType.NetworkBridge] })
				.where(({ bridgeRow }) => (
					eq(
						bridgeRow[EntityMetaKey.IdKey],
						bridgeIdKey,
					)
				))
				.select(({ bridgeRow }) => ({ bridgeRow }))
		),
		[() => bridgeIdKey],
	)

	const bridgeRow = $derived(
		(
			bridgeQuery.data?.find(
				(row) => row.bridgeRow[EntityMetaKey.Source] === Source.Chainlist_Rest,
			)?.bridgeRow
			?? bridgeQuery.data?.find(
				(row) => row.bridgeRow[EntityMetaKey.Source] === Source.EthereumLists_Rest,
			)?.bridgeRow
			?? bridgeQuery.data?.[0]?.bridgeRow
		)
	)

	const bridgeField = $derived(
		(() => {
			const bag = bridgeRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				relationshipType: typeof b.relationshipType === 'string' && b.relationshipType.length ? b.relationshipType : undefined,
			}
		})(),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkBridge}
	{entityId}
	{href}
	{open}
	title={`Bridge to chain ${String(entityId.$toNetwork.chainId)}`}
>
	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NetworkBridge}
			{entityId}
		>
			<QueryBoundary
				query={bridgeQuery}
			>
				{#snippet children(_rows)}
					<dl>
						<div>
							<dt>From network</dt>
							<dd>
								Chain {String(entityId.$fromNetwork.chainId)}
							</dd>
						</div>
						<div>
							<dt>To network</dt>
							<dd>
								Chain {String(entityId.$toNetwork.chainId)}
							</dd>
						</div>
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={entityId.url}
									rel="noreferrer"
									target="_blank"
								>
									{entityId.url}
								</a>
							</dd>
						</div>
						{#if bridgeField?.relationshipType !== undefined}
							<div>
								<dt>Relationship type</dt>
								<dd>{bridgeField.relationshipType}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
