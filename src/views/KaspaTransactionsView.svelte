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
	}: EntityListViewProps<EntityType.KaspaTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaTransaction })}
		{@const kaspaTransactionSelector = kaspaTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaTransaction}
			entitySelector={kaspaTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/kaspa/[transactionId=stringSegment]',
					{
						network: (
							kaspaTransactionSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(kaspaTransactionSelector.$network.$network.caip2)
							:
								kaspaTransactionSelector.$network.$network.slug
						),
						transactionId: kaspaTransactionSelector.transactionId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
