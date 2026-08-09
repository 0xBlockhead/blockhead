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
	}: EntityListViewProps<EntityType.HyperliquidVault_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidVault_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidVaultTimestamp })}
		{@const hyperliquidVaultTimestampSelector = hyperliquidVaultTimestamp[EntityMetaKey.Selector]}
		{@const vault = hyperliquidVaultTimestampSelector.$vault}
		<EntityView
			entityType={EntityType.HyperliquidVault_Timestamp}
			entitySelector={hyperliquidVaultTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]/(hyperliquidVault)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in vault.$network ?
								caip2StringFromValue(vault.$network.caip2)
							:
								vault.$network.slug
						),
						vaultAddress: vault.vaultAddress,
						timestampMs: String(hyperliquidVaultTimestampSelector.timestampMs),
						source: hyperliquidVaultTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
