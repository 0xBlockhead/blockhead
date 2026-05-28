<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Deployments',
		open = $bindable(true),
		collapsible = true,
		id,
		entityFieldReference,
		representationFilter,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			id: string
			representationFilter?: CoinInstanceRepresentation
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmCoinInstance
			>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
		{...EntitiesListProps}
		bind:open
		{collapsible}
		entityType={EntityType.EvmCoinInstance}
		{id}
		{title}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				Deployments are concrete representations of this asset on a chain: native currency or a token contract.
			</p>
			<p>
				The same logical coin can exist on many networks; each row is one chain-specific instance.
			</p>
		{/snippet}

		{#snippet Empty()}
			<p data-text="muted">
				{representationFilter === CoinInstanceRepresentation.BridgeWrapped ?
					'No bridge-wrapped deployments classified for this coin yet.'
				:
					'No deployments yet.'}
			</p>
		{/snippet}

		{#snippet body({ open: _bodyOpen })}
			{#if open}
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						$: [
							Source.Coingecko_Rest,
							Source.CoinMarketCap_Rest,
							Source.Coinpaprika_OpenApi,
							Source.Defillama_OpenApi,
							Source.Constants_Internal,
						],
						[entityFieldReference.fieldName]: {
							$: [
								Source.Constants_Internal,
								Source.Coingecko_Rest,
							],
						},
					},
				)}
				{@const coinInstances = derive(
					parent,
					(parent) => {
						const rows: Entity<typeof schema, EntityType.EvmCoinInstance>[] = (
							parent[entityFieldReference.fieldName] ?? []
						)
						return (
							rows
								.filter((row) => (
									representationFilter == null
									|| row.representation === representationFilter
								))
								.map((value) => ({
									value,
								}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmCoinInstance}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
					getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
					placeholderText="Loading deployments…"
					resource={coinInstances}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							{representationFilter === CoinInstanceRepresentation.BridgeWrapped ?
								'No bridge-wrapped deployments classified for this coin yet.'
							:
								'No deployments yet.'}
						</p>
					{/snippet}

					{#snippet Item({ item })}
						{@const coinInstanceId = item.value[EntityMetaKey.Id]}
						<EvmCoinInstanceView
							entityId={coinInstanceId}
							id={stringify(coinInstanceId)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
