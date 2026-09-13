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
	}: EntityListViewProps<EntityType.TezosCycle> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosCycle}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosCycle })}
		{@const tezosCycleSelector = tezosCycle[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosCycle}
			entitySelector={tezosCycleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/cycle/[cycle=nonNegativeBigInt]',
					{
						network: (
							tezosCycleSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(tezosCycleSelector.$network.$network.caip2)
							:
								tezosCycleSelector.$network.$network.slug
						),
						cycle: String(tezosCycleSelector.cycle),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
