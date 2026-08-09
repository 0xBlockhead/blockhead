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
	}: EntityListViewProps<EntityType.TonWorkchain> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonWorkchain}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonWorkchain })}
		{@const tonWorkchainSelector = tonWorkchain[EntityMetaKey.Selector]}
		{@const network = tonWorkchainSelector.$network}
		<EntityView
			entityType={EntityType.TonWorkchain}
			entitySelector={tonWorkchainSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/workchain/[workchain=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						workchain: String(tonWorkchainSelector.workchain),
					}
				)
			}
		>
			{#snippet Title()}
				TON workchain
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
