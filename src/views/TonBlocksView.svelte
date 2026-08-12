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
				'workchain' in tonBlockSelector
				&& 'shardPrefix' in tonBlockSelector
				&& 'seqno' in tonBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/[workchain=integer]/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
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
					'rootHash' in tonBlockSelector
					&& 'fileHash' in tonBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/hash/[rootHash=stringSegment]/[fileHash=stringSegment]',
							{
								network: (
									'caip2' in network ?
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
