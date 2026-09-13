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
	}: EntityListViewProps<EntityType.TronToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronToken}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronToken })}
		{@const tronTokenSelector = tronToken[EntityMetaKey.Selector]}
		{@const network = tronTokenSelector.$network}
		<EntityView
			entityType={EntityType.TronToken}
			entitySelector={tronTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						tokenId: tronTokenSelector.tokenId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
