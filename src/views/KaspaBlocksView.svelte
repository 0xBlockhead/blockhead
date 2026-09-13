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
	}: EntityListViewProps<EntityType.KaspaBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaBlock })}
		{@const kaspaBlockSelector = kaspaBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaBlock}
			entitySelector={kaspaBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]',
					{
						network: (
							kaspaBlockSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(kaspaBlockSelector.$network.$network.caip2)
							:
								kaspaBlockSelector.$network.$network.slug
						),
						blockHash: kaspaBlockSelector.blockHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
