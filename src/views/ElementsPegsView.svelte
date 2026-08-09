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
	}: EntityListViewProps<EntityType.ElementsPeg> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsPeg}
	bind:open
	resource={
		selection({
			...{
				fields: {
					direction: true,
					pegTransactionId: true,
					amountSats: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: elementsPeg })}
		{@const elementsPegSelector = elementsPeg[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsPeg}
			entitySelector={elementsPegSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]',
					{
						network: (
							'caip2' in elementsPegSelector.$network.$network ?
								caip2StringFromValue(elementsPegSelector.$network.$network.caip2)
							:
								elementsPegSelector.$network.$network.slug
						),
						pegTransactionId: elementsPegSelector.pegTransactionId,
						direction: elementsPegSelector.direction,
					}
				)
			}
		>
			{#snippet Title()}
				{[elementsPegSelector.direction, elementsPegSelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg'}
			{/snippet}

			{#snippet Value()}
				{elementsPeg.amountSats ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
