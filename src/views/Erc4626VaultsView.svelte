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
	}: EntityListViewProps<EntityType.Erc4626Vault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4626Vault}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				$asset: true,
			},
		})
	}
>
	{#snippet Item({ item: erc4626Vault })}
		{@const erc4626VaultSelector = erc4626Vault[EntityMetaKey.Selector]}
		{@const contract = erc4626VaultSelector.$contract}
		<EntityView
			entityType={EntityType.Erc4626Vault}
			entitySelector={erc4626VaultSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/erc-4626',
					{
						network: (
							'caip2' in contract.$network ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[(erc4626Vault.name ?? ''), (erc4626Vault.symbol ?? '')].filter(Boolean).join(' ') || 'erc4626 vault'}
			{/snippet}

			{#snippet Value()}
				{erc4626Vault.$asset == null ? '' : [erc4626Vault.$asset.NativeCurrency.symbol, (erc4626Vault.$asset.NativeCurrency.name ?? ''), erc4626Vault.$asset.Erc20Token.symbol, (erc4626Vault.$asset.Erc20Token.name ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
