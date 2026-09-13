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
	}: EntityListViewProps<EntityType.TezosBaker> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBaker}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBaker })}
		{@const tezosBakerSelector = tezosBaker[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosBaker}
			entitySelector={tezosBakerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]',
					{
						network: (
							tezosBakerSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(tezosBakerSelector.$network.$network.caip2)
							:
								tezosBakerSelector.$network.$network.slug
						),
						address: tezosBakerSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
