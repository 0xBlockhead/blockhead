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
	}: EntityListViewProps<EntityType.XrplAmm_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmm_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmmTimestamp })}
		{@const xrplAmmTimestampSelector = xrplAmmTimestamp[EntityMetaKey.Selector]}
		{@const amm = xrplAmmTimestampSelector.$amm}
		<EntityView
			entityType={EntityType.XrplAmm_Timestamp}
			entitySelector={xrplAmmTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]/(xrplAmm)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							amm.$network.caip2 !== undefined ?
								caip2StringFromValue(amm.$network.caip2)
							:
								amm.$network.slug
						),
						ammAccount: amm.ammAccount,
						ledgerIndex: String(xrplAmmTimestampSelector.ledgerIndex),
						source: xrplAmmTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL AMM timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
