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
	}: EntityListViewProps<EntityType.MorphoVaultPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoVaultPosition}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$vault: true,
					assets: true,
					shares: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: morphoVaultPosition })}
		{@const morphoVaultPositionSelector = morphoVaultPosition[EntityMetaKey.Selector]}
		{@const vault = morphoVaultPositionSelector.$vault}
		<EntityView
			entityType={EntityType.MorphoVaultPosition}
			entitySelector={morphoVaultPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-vault/[vaultAddress=evmAddress]/(morphoVault)/position/[accountAddress=evmAddress]',
					{
						network: (
							'caip2' in vault.$network ?
								caip2StringFromValue(vault.$network.caip2)
							:
								vault.$network.slug
						),
						vaultAddress: vault.vaultAddress,
						accountAddress: morphoVaultPositionSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[morphoVaultPosition.$vault.name, morphoVaultPosition.$vault.symbol].filter(Boolean).join(' ') || 'Morpho vault'}
			{/snippet}

			{#snippet Value()}
				{[morphoVaultPosition.assets, morphoVaultPosition.shares].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
