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
	}: EntityListViewProps<EntityType.TezosToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosToken}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosToken })}
		{@const tezosTokenSelector = tezosToken[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosToken}
			entitySelector={tezosTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in tezosTokenSelector.$network.$network ?
								caip2StringFromValue(tezosTokenSelector.$network.$network.caip2)
							:
								tezosTokenSelector.$network.$network.slug
						),
						contractAddress: tezosTokenSelector.contractAddress,
						tokenId: String(tezosTokenSelector.tokenId),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
