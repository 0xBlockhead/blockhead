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
	}: EntityListViewProps<EntityType.HyperliquidVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidVault}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidVault })}
		{@const hyperliquidVaultSelector = hyperliquidVault[EntityMetaKey.Selector]}
		{@const network = hyperliquidVaultSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidVault}
			entitySelector={hyperliquidVaultSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						vaultAddress: hyperliquidVaultSelector.vaultAddress,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
