<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Contracts',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof EntityType.EvmContract>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const networkIdKey = $derived(
		stringify(entityFieldReference.entityId),
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight! })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.select(({ blockHeight }) => ({
					height: blockHeight[EntityMetaKey.Value],
				}))
				.findOne()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => networkIdKey,
		],
	)

	const contractsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$evmContracts: entityFieldCollections[EntityType.Network]['$$evmContracts']! })
				.where(({ $$evmContracts }) => (
					eq(
						$$evmContracts[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ $$evmContracts }) => (
					eq(
						$$evmContracts[EntityMetaKey.Source],
						Source.Blockscout_Rest,
					)
				))
				.orderBy(({ $$evmContracts }) => (
					$$evmContracts[EntityMetaKey.IdKey]
				), 'desc')
				.limit(16)
				.select(({ $$evmContracts }) => (
					{
						[EntityMetaKey.Id]: (
							$$evmContracts[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}
				))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => networkIdKey,
			() => blockHeightQuery.data?.height,
		],
	)


	// Components
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmContract}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			placeholderText="Loading contracts…"
			query={contractsQuery}
		>
			{#snippet children(contracts)}
				<OrderedList
					items={new SvelteSet(contracts ?? [])}
					getKey={(row) => (
						BigInt(
							row[EntityMetaKey.Id].address,
						)
					)}
					getStableItemKey={(row) => stringify(row[EntityMetaKey.Id])}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No verified contracts for this network yet. Try again shortly.
						</p>
					{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							<EvmContractView
								entityId={row[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(
											row[EntityMetaKey.Id].$network.chainId,
										),
										address: row[EntityMetaKey.Id].address,
									},
								)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</OrderedList>
			{/snippet}
		</QueryBoundary>
	{/snippet}
</EntitiesList>
