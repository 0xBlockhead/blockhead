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
		title = 'Storage reads',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmStorageRead_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmStorageRead_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				value: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: evmStorageReadTimestamp })}
		{@const evmStorageReadTimestampSelector = evmStorageReadTimestamp[EntityMetaKey.Selector]}
		{@const contract = evmStorageReadTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.EvmStorageRead_Timestamp}
			entitySelector={evmStorageReadTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/storage/[slot=zeroExHex]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							contract.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.address,
						slot: evmStorageReadTimestampSelector.slot,
						timestampMs: String(evmStorageReadTimestampSelector.timestampMs),
						source: evmStorageReadTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{evmStorageReadTimestampSelector.slot || 'EVM storage read timestamp'}
			{/snippet}

			{#snippet Value()}
				{evmStorageReadTimestamp.value ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmStorageReadTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
