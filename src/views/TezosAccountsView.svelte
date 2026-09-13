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
	}: EntityListViewProps<EntityType.TezosAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosAccount })}
		{@const tezosAccountSelector = tezosAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosAccount}
			entitySelector={tezosAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
					{
						network: (
							tezosAccountSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(tezosAccountSelector.$network.$network.caip2)
							:
								tezosAccountSelector.$network.$network.slug
						),
						address: tezosAccountSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
