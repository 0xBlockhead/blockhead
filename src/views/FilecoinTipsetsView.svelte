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
	}: EntityListViewProps<EntityType.FilecoinTipset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinTipset}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
			fields: {
				height: true,
				tipsetKey: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinTipset })}
		{@const filecoinTipsetSelector = filecoinTipset[EntityMetaKey.Selector]}
		{@const network = filecoinTipsetSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinTipset}
			entitySelector={filecoinTipsetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/tipset/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						height: String(filecoinTipsetSelector.height),
						tipsetKey: filecoinTipsetSelector.tipsetKey,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinTipsetSelector.height}
			{/snippet}

			{#snippet Value()}
				{filecoinTipsetSelector.tipsetKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinTipset.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
