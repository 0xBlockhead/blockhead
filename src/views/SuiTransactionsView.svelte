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
	}: EntityListViewProps<EntityType.SuiTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiTransaction })}
		{@const suiTransactionSelector = suiTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiTransaction}
			entitySelector={suiTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]',
					{
						network: (
							'caip2' in suiTransactionSelector.$network.$network ?
								caip2StringFromValue(suiTransactionSelector.$network.$network.caip2)
							:
								suiTransactionSelector.$network.$network.slug
						),
						digest: suiTransactionSelector.digest,
					}
				)
			}
		>
			{#snippet Title()}
				Sui transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
