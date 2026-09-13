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
	}: EntityListViewProps<EntityType.NftToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NftToken}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: nftToken })}
		{@const nftTokenSelector = nftToken[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NftToken}
			entitySelector={nftTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection/(nftCollection)/token/[tokenKey=stringSegment]',
					{
						network: (
							nftTokenSelector.$collection.$assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(nftTokenSelector.$collection.$assetInstance.$network.caip2)
							:
								nftTokenSelector.$collection.$assetInstance.$network.slug
						),
						kind: nftTokenSelector.$collection.$assetInstance.kind,
						assetKey: nftTokenSelector.$collection.$assetInstance.assetKey,
						tokenKey: nftTokenSelector.tokenKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
