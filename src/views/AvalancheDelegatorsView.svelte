<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			...{
				fields: {
					delegatorAddress: true,
					stakeAmountNavax: true,
					txId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: avalancheDelegator })}
		{@const avalancheDelegatorSelector = avalancheDelegator[EntityMetaKey.Selector]}
		{@const validator = avalancheDelegatorSelector.$validator}
		<EntityView
			entityType={EntityType.AvalancheDelegator}
			entitySelector={avalancheDelegatorSelector}
			href={
				resolve(
					'/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]/(avalancheValidator)/delegator/[txId=stringSegment]',
					{
						nodeId: validator.nodeId,
						subnetId: validator.subnetId,
						startTimeMs: String(validator.startTimeMs),
						txId: avalancheDelegatorSelector.txId,
					}
				)
			}
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
