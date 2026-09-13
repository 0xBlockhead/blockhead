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
	}: EntityListViewProps<EntityType.TonBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonBlock })}
		{@const tonBlockSelector = tonBlock[EntityMetaKey.Selector]}
		{@const network = tonBlockSelector.$network}
		<EntityView
			entityType={EntityType.TonBlock}
			entitySelector={tonBlockSelector}
			href={
				tonBlockSelector.workchain !== undefined
				&& tonBlockSelector.shardPrefix !== undefined
				&& tonBlockSelector.seqno !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/[workchain=integer]/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							workchain: String(tonBlockSelector.workchain),
							shardPrefix: tonBlockSelector.shardPrefix,
							seqno: String(tonBlockSelector.seqno),
						}
					)
				:
					tonBlockSelector.rootHash !== undefined
					&& tonBlockSelector.fileHash !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/hash/[rootHash=stringSegment]/[fileHash=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								rootHash: tonBlockSelector.rootHash,
								fileHash: tonBlockSelector.fileHash,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				TON block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
