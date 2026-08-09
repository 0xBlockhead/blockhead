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
	}: EntityListViewProps<EntityType.TezosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBlock })}
		{@const tezosBlockSelector = tezosBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosBlock}
			entitySelector={tezosBlockSelector}
			href={
				'hash' in tezosBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/hash/tezos/[hash=stringSegment]',
						{
							network: (
								'caip2' in tezosBlockSelector.$network.$network ?
									caip2StringFromValue(tezosBlockSelector.$network.$network.caip2)
								:
									tezosBlockSelector.$network.$network.slug
							),
							hash: tezosBlockSelector.hash,
						}
					)
				:
					'level' in tezosBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/level/[level=nonNegativeBigInt]',
							{
								network: (
									'caip2' in tezosBlockSelector.$network.$network ?
										caip2StringFromValue(tezosBlockSelector.$network.$network.caip2)
									:
										tezosBlockSelector.$network.$network.slug
								),
								level: String(tezosBlockSelector.level),
							}
						)
					:
						undefined
			}
		/>
	{/snippet}
</EntitiesList>
