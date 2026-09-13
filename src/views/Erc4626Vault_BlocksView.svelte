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
	}: EntityListViewProps<EntityType.Erc4626Vault_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4626Vault_Block}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4626VaultBlock })}
		{@const erc4626VaultBlockSelector = erc4626VaultBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Erc4626Vault_Block}
			entitySelector={erc4626VaultBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/erc-4626/(erc4626Vault)/block/[blockNumber=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							erc4626VaultBlockSelector.$vault.$contract.$network.caip2 !== undefined ?
								caip2StringFromValue(erc4626VaultBlockSelector.$vault.$contract.$network.caip2)
							:
								erc4626VaultBlockSelector.$vault.$contract.$network.slug
						),
						address: erc4626VaultBlockSelector.$vault.$contract.address,
						blockNumber: String(erc4626VaultBlockSelector.blockNumber),
						source: erc4626VaultBlockSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{erc4626VaultBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{erc4626VaultBlockSelector.source}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
