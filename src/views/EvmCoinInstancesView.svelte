<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
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
			collapsible?: boolean
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

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
				<ResourceBoundary
					resource={proxy(
							entityFieldReference.entityType,
							entityFieldReference.selector,
							{
								sources: [
									Source.Coingecko_Rest,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Constants_Internal,
								],
							},
						).field(entityFieldReference.fieldName, {
							sources: [
								Source.Constants_Internal,
								Source.Coingecko_Rest,
							],
						})}
					placeholderText="Loading deployments…"
				>
					{#snippet children(coinInstances)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmCoinInstance}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(coinInstance) => stringify(coinInstance.entitySelector)}
					getSortValue={(coinInstance) => stringify(coinInstance.entitySelector)}
					placeholderText="Loading deployments…"
					items={coinInstances.entities.filter((coinInstance, index) => (
						representationFilter == null
						|| coinInstances.values[index]?.representation === representationFilter
					))}
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
						{@const coinInstanceId = item.entitySelector}
						<EvmCoinInstanceView
							selector={coinInstanceId}
							layout={EntityLayout.Summary}

						/>
					{/snippet}
				</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
