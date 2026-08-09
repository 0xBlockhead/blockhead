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
	}: EntityListViewProps<EntityType.EulerEvkVaultPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EulerEvkVaultPosition}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$vault: true,
					assets: true,
					borrowed: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eulerEvkVaultPosition })}
		{@const eulerEvkVaultPositionSelector = eulerEvkVaultPosition[EntityMetaKey.Selector]}
		{@const vault = eulerEvkVaultPositionSelector.$vault}
		<EntityView
			entityType={EntityType.EulerEvkVaultPosition}
			entitySelector={eulerEvkVaultPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/euler/vault/[vaultAddress=evmAddress]/(eulerEvkVault)/position/[accountAddress=evmAddress]',
					{
						network: (
							'caip2' in vault.$network ?
								caip2StringFromValue(vault.$network.caip2)
							:
								vault.$network.slug
						),
						vaultAddress: vault.vaultAddress,
						accountAddress: eulerEvkVaultPositionSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[eulerEvkVaultPosition.$vault.name, eulerEvkVaultPosition.$vault.symbol].filter(Boolean).join(' ') || 'Euler EVK vault'}
			{/snippet}

			{#snippet Value()}
				{[eulerEvkVaultPosition.assets, eulerEvkVaultPosition.borrowed].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
