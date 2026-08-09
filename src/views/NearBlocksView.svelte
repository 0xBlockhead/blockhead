<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearBlock}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.NearBlocks_Rest,
					Source.NearRpc_JsonRpc,
				],
				fields: {
					height: true,
					hash: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearBlock })}
		{@const nearBlockSelector = nearBlock[EntityMetaKey.Selector]}
		{@const network = nearBlockSelector.$network}
		<EntityView
			entityType={EntityType.NearBlock}
			entitySelector={nearBlockSelector}
			href={
				'hash' in nearBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(nearBlockSelector.height),
							hash: nearBlockSelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(nearBlockSelector.height),
						}
					)
			}
		>
			{#snippet Title()}
				{nearBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{nearBlock.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
