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
	}: EntityListViewProps<EntityType.FilecoinActor> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinActor}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				address: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinActor })}
		{@const filecoinActorSelector = filecoinActor[EntityMetaKey.Selector]}
		{@const network = filecoinActorSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinActor}
			entitySelector={filecoinActorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: filecoinActorSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinActorSelector.address || 'filecoin actor'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
