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
		title = 'Contract source bundles',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmContractSourceBundle> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContractSourceBundle}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: evmContractSourceBundle })}
		{@const evmContractSourceBundleSelector = evmContractSourceBundle[EntityMetaKey.Selector]}
		{@const contract = evmContractSourceBundleSelector.$contract}
		<EntityView
			entityType={EntityType.EvmContractSourceBundle}
			entitySelector={evmContractSourceBundleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/source-bundle',
					{
						network: (
							contract.$network.caip2 !== undefined ?
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
				{[(evmContractSourceBundle.$contract.precompileName ?? ''), evmContractSourceBundleSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{[(evmContractSourceBundle.$contract.precompileName ?? ''), evmContractSourceBundleSelector.$contract.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
