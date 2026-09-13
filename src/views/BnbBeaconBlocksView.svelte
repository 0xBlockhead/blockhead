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
	}: EntityListViewProps<EntityType.BnbBeaconBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconBlock })}
		{@const bnbBeaconBlockSelector = bnbBeaconBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconBlock}
			entitySelector={bnbBeaconBlockSelector}
			href={
				bnbBeaconBlockSelector.hash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/block/hash/[hash=stringSegment]',
						{
							network: (
								bnbBeaconBlockSelector.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(bnbBeaconBlockSelector.$network.$network.caip2)
								:
									bnbBeaconBlockSelector.$network.$network.slug
							),
							hash: bnbBeaconBlockSelector.hash,
						}
					)
				:
					bnbBeaconBlockSelector.height !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/block/height/[height=nonNegativeBigInt]',
							{
								network: (
									bnbBeaconBlockSelector.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(bnbBeaconBlockSelector.$network.$network.caip2)
									:
										bnbBeaconBlockSelector.$network.$network.slug
								),
								height: String(bnbBeaconBlockSelector.height),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{bnbBeaconBlock.height}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
