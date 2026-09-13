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
	}: EntityListViewProps<EntityType.XrplTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTransaction })}
		{@const xrplTransactionSelector = xrplTransaction[EntityMetaKey.Selector]}
		{@const network = xrplTransactionSelector.$network}
		<EntityView
			entityType={EntityType.XrplTransaction}
			entitySelector={xrplTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/xrpl/[hash=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						hash: xrplTransactionSelector.hash,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
