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
	}: EntityListViewProps<EntityType.QuilibriumFrame> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.QuilibriumFrame}
	bind:open
	resource={
		selection({
			...{
				fields: {
					frameNumber: true,
					shardKey: true,
					frameHash: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: quilibriumFrame })}
		{@const quilibriumFrameSelector = quilibriumFrame[EntityMetaKey.Selector]}
		{@const network = quilibriumFrameSelector.$network}
		<EntityView
			entityType={EntityType.QuilibriumFrame}
			entitySelector={quilibriumFrameSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/frame/[frameNumber=nonNegativeBigInt]/[shardKey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						frameNumber: String(quilibriumFrameSelector.frameNumber),
						shardKey: quilibriumFrameSelector.shardKey,
					}
				)
			}
		>
			{#snippet Title()}
				{quilibriumFrameSelector.frameNumber}
			{/snippet}

			{#snippet Value()}
				{quilibriumFrameSelector.shardKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{quilibriumFrame.frameHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
