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
	}: EntityListViewProps<EntityType.CurveLendingVault> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CurveLendingVault}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					lendApy: true,
					borrowApy: true,
					usdTotal: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: curveLendingVault })}
		{@const curveLendingVaultSelector = curveLendingVault[EntityMetaKey.Selector]}
		{@const network = curveLendingVaultSelector.$network}
		<EntityView
			entityType={EntityType.CurveLendingVault}
			entitySelector={curveLendingVaultSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/lending-vault/[vaultAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						vaultAddress: curveLendingVaultSelector.vaultAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{curveLendingVault.name || 'Curve Lend vault'}
			{/snippet}

			{#snippet Value()}
				{[String(curveLendingVault.lendApy ?? ''), String(curveLendingVault.borrowApy ?? ''), String(curveLendingVault.usdTotal ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{curveLendingVault.$network.name || `${curveLendingVault.$network.caip2.namespace}:${curveLendingVault.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
