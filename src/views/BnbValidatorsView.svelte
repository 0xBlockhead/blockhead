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
	}: EntityListViewProps<EntityType.BnbValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbValidator}
	bind:open
	resource={
		selection({
			fields: {
				moniker: true,
				consensusAddress: true,
				operatorAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbValidator })}
		{@const bnbValidatorSelector = bnbValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbValidator}
			entitySelector={bnbValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/validator/[operatorAddress=stringSegment]',
					{
						network: (
							'caip2' in bnbValidatorSelector.$network.$network ?
								caip2StringFromValue(bnbValidatorSelector.$network.$network.caip2)
							:
								bnbValidatorSelector.$network.$network.slug
						),
						operatorAddress: bnbValidatorSelector.operatorAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{(bnbValidator.moniker ?? '') || bnbValidatorSelector.operatorAddress || 'bnb validator'}
			{/snippet}

			{#snippet Value()}
				{bnbValidator.consensusAddress ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
