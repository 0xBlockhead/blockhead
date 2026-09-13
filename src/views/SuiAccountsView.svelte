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
	}: EntityListViewProps<EntityType.SuiAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiAccount })}
		{@const suiAccountSelector = suiAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiAccount}
			entitySelector={suiAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
					{
						network: (
							suiAccountSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiAccountSelector.$network.$network.caip2)
							:
								suiAccountSelector.$network.$network.slug
						),
						address: suiAccountSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				Sui account
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
