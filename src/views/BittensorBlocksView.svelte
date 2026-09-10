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
	}: EntityListViewProps<EntityType.BittensorBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				hash: true,
				extrinsicCount: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorBlock })}
		{@const bittensorBlockSelector = bittensorBlock[EntityMetaKey.Selector]}
		{@const network = bittensorBlockSelector.$network}
		<EntityView
			entityType={EntityType.BittensorBlock}
			entitySelector={bittensorBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						blockNumber: String(bittensorBlockSelector.blockNumber),
						hash: bittensorBlockSelector.hash,
					}
				)
			}
		>
			{#snippet Title()}
				{bittensorBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{bittensorBlockSelector.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bittensorBlock.extrinsicCount != null ? bittensorBlock.extrinsicCount + ' extrinsics' : ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
