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
	}: EntityListViewProps<EntityType.TezosEntrypoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosEntrypoint}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosEntrypoint })}
		{@const tezosEntrypointSelector = tezosEntrypoint[EntityMetaKey.Selector]}
		{@const contract = tezosEntrypointSelector.$contract}
		<EntityView
			entityType={EntityType.TezosEntrypoint}
			entitySelector={tezosEntrypointSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/entrypoint/[entrypointName=stringSegment]',
					{
						network: (
							'caip2' in contract.$network.$network ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						address: contract.address,
						entrypointName: tezosEntrypointSelector.entrypointName,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
