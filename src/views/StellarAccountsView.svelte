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
	}: EntityListViewProps<EntityType.StellarAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccount })}
		{@const stellarAccountSelector = stellarAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarAccount}
			entitySelector={stellarAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]',
					{
						network: (
							stellarAccountSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(stellarAccountSelector.$network.$network.caip2)
							:
								stellarAccountSelector.$network.$network.slug
						),
						accountId: stellarAccountSelector.accountId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
