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
	}: EntityListViewProps<EntityType.HederaBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaBlock })}
		{@const hederaBlockSelector = hederaBlock[EntityMetaKey.Selector]}
		{@const network = hederaBlockSelector.$network}
		<EntityView
			entityType={EntityType.HederaBlock}
			entitySelector={hederaBlockSelector}
			href={
				hederaBlockSelector.blockHash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: hederaBlockSelector.blockHash,
						}
					)
				:
					hederaBlockSelector.blockNumber !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								blockNumber: String(hederaBlockSelector.blockNumber),
							}
						)
					:
						undefined
			}
		/>
	{/snippet}
</EntitiesList>
