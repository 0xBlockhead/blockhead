<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.EigenLayerDelegation_Timestamp}
			entitySelector={eigenLayerDelegationTimestampSelector}
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
