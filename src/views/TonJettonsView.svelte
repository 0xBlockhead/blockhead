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
	}: EntityListViewProps<EntityType.TonJetton> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJetton}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJetton })}
		{@const tonJettonSelector = tonJetton[EntityMetaKey.Selector]}
		{@const network = tonJettonSelector.$network}
		<EntityView
			entityType={EntityType.TonJetton}
			entitySelector={tonJettonSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton/[masterAddress=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						masterAddress: tonJettonSelector.masterAddress,
					}
				)
			}
		>
			{#snippet Title()}
				TON jetton
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
