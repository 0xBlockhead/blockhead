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
	}: EntityListViewProps<EntityType.AvalancheDelegator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheDelegator}
	bind:open
	resource={
		selection({
			fields: {
				delegatorAddress: true,
				stakeAmountNavax: true,
				txId: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheDelegator })}
		{@const avalancheDelegatorSelector = avalancheDelegator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheDelegator}
			entitySelector={avalancheDelegatorSelector}
		>
			{#snippet Title()}
				{(avalancheDelegator.delegatorAddress ?? '') || avalancheDelegatorSelector.txId || 'avalanche delegator'}
			{/snippet}

			{#snippet Value()}
				{avalancheDelegator.stakeAmountNavax ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
