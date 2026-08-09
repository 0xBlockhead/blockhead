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
	}: EntityListViewProps<EntityType.AlgorandAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAccount })}
		{@const algorandAccountSelector = algorandAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandAccount}
			entitySelector={algorandAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]',
					{
						network: (
							'caip2' in algorandAccountSelector.$network.$network ?
								caip2StringFromValue(algorandAccountSelector.$network.$network.caip2)
							:
								algorandAccountSelector.$network.$network.slug
						),
						address: algorandAccountSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
