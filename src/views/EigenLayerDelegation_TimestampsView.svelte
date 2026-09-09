<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EigenLayerDelegation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerDelegation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$staker: true,
				$operator: true,
				$strategy: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerDelegationTimestamp })}
		{@const eigenLayerDelegationTimestampSelector = eigenLayerDelegationTimestamp[EntityMetaKey.Selector]}
		{@const operator = eigenLayerDelegationTimestampSelector.$operator}
		<EntityView
			entityType={EntityType.EigenLayerDelegation_Timestamp}
			entitySelector={eigenLayerDelegationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/delegation/staker/[stakerAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in operator.$network ?
								caip2StringFromValue(operator.$network.caip2)
							:
								operator.$network.slug
						),
						operatorAddress: operator.operatorAddress,
						stakerAddress: eigenLayerDelegationTimestampSelector.$staker.$actor.address,
						strategyAddress: eigenLayerDelegationTimestampSelector.$strategy.strategyAddress,
						timestampMs: String(eigenLayerDelegationTimestampSelector.timestampMs),
						source: eigenLayerDelegationTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerDelegationTimestampSelector.$staker.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerDelegationTimestampSelector.$operator.operatorAddress || 'eigen layer operator'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerDelegationTimestampSelector.$strategy.strategyAddress || 'eigen layer strategy'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
