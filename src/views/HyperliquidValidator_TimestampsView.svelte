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
	}: EntityListViewProps<EntityType.HyperliquidValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidValidator_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidValidatorTimestamp })}
		{@const hyperliquidValidatorTimestampSelector = hyperliquidValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = hyperliquidValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.HyperliquidValidator_Timestamp}
			entitySelector={hyperliquidValidatorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/hyperliquid/[validator=stringSegment]/(hyperliquidValidator)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in validator.$network ?
								caip2StringFromValue(validator.$network.caip2)
							:
								validator.$network.slug
						),
						validator: validator.validator,
						timestampMs: String(hyperliquidValidatorTimestampSelector.timestampMs),
						source: hyperliquidValidatorTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
