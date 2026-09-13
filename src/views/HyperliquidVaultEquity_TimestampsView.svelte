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
	}: EntityListViewProps<EntityType.HyperliquidVaultEquity_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidVaultEquityTimestamp })}
		{@const hyperliquidVaultEquityTimestampSelector = hyperliquidVaultEquityTimestamp[EntityMetaKey.Selector]}
		{@const vault = hyperliquidVaultEquityTimestampSelector.$vault}
		<EntityView
			entityType={EntityType.HyperliquidVaultEquity_Timestamp}
			entitySelector={hyperliquidVaultEquityTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]/(hyperliquidVault)/equity/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							vault.$network.caip2 !== undefined ?
								caip2StringFromValue(vault.$network.caip2)
							:
								vault.$network.slug
						),
						vaultAddress: vault.vaultAddress,
						address: hyperliquidVaultEquityTimestampSelector.$account.address,
						timestampMs: String(hyperliquidVaultEquityTimestampSelector.timestampMs),
						source: hyperliquidVaultEquityTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
