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
	}: EntityListViewProps<EntityType.EulerEvkVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EulerEvkVault}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					symbol: true,
					totalAssets: true,
					utilization: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eulerEvkVault })}
		{@const eulerEvkVaultSelector = eulerEvkVault[EntityMetaKey.Selector]}
		{@const network = eulerEvkVaultSelector.$network}
		<EntityView
			entityType={EntityType.EulerEvkVault}
			entitySelector={eulerEvkVaultSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/euler/vault/[vaultAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						vaultAddress: eulerEvkVaultSelector.vaultAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[eulerEvkVault.name, eulerEvkVault.symbol].filter(Boolean).join(' ') || 'Euler EVK vault'}
			{/snippet}

			{#snippet Value()}
				{[(eulerEvkVault.totalAssets ?? ''), String(eulerEvkVault.utilization ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eulerEvkVault.$network.name || (eulerEvkVault.$network.caip2 == null ? '' : `${eulerEvkVault.$network.caip2.namespace}:${eulerEvkVault.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
