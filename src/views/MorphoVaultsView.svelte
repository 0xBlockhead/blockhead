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
	}: EntityListViewProps<EntityType.MorphoVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoVault}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					symbol: true,
					listed: true,
					apy: true,
					netApy: true,
					totalAssets: true,
					assetAddress: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: morphoVault })}
		{@const morphoVaultSelector = morphoVault[EntityMetaKey.Selector]}
		{@const network = morphoVaultSelector.$network}
		<EntityView
			entityType={EntityType.MorphoVault}
			entitySelector={morphoVaultSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-vault/[vaultAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						vaultAddress: morphoVaultSelector.vaultAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[morphoVault.name, morphoVault.symbol].filter(Boolean).join(' ') || 'Morpho vault'}
			{/snippet}

			{#snippet Value()}
				{[String(morphoVault.listed), String(morphoVault.apy ?? ''), String(morphoVault.netApy ?? ''), (morphoVault.totalAssets ?? ''), morphoVault.assetAddress].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{morphoVault.$network.name || `${morphoVault.$network.caip2.namespace}:${morphoVault.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
