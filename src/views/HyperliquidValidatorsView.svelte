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
	}: EntityListViewProps<EntityType.HyperliquidValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidValidator}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidValidator })}
		{@const hyperliquidValidatorSelector = hyperliquidValidator[EntityMetaKey.Selector]}
		{@const network = hyperliquidValidatorSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidValidator}
			entitySelector={hyperliquidValidatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/hyperliquid/[validator=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						validator: hyperliquidValidatorSelector.validator,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
