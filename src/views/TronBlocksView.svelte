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
	}: EntityListViewProps<EntityType.TronBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				hash: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: tronBlock })}
		{@const tronBlockSelector = tronBlock[EntityMetaKey.Selector]}
		{@const network = tronBlockSelector.$network}
		<EntityView
			entityType={EntityType.TronBlock}
			entitySelector={tronBlockSelector}
			href={
				'hash' in tronBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(tronBlockSelector.height),
							hash: tronBlockSelector.hash,
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
							blockNumber: String(tronBlockSelector.height),
						}
					)
			}
		>
			{#snippet Title()}
				{tronBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{tronBlock.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
