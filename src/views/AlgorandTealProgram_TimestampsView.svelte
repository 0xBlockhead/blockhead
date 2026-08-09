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
		title = 'Algorand TEAL program observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandTealProgram_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandTealProgram_Timestamp}
	{title}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandTealProgramTimestamp })}
		{@const algorandTealProgramTimestampSelector = algorandTealProgramTimestamp[EntityMetaKey.Selector]}
		{@const program = algorandTealProgramTimestampSelector.$program}
		<EntityView
			entityType={EntityType.AlgorandTealProgram_Timestamp}
			entitySelector={algorandTealProgramTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]/(algorandTealProgram)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in program.$network.$network ?
								caip2StringFromValue(program.$network.$network.caip2)
							:
								program.$network.$network.slug
						),
						programHash: program.programHash,
						timestampMs: String(algorandTealProgramTimestampSelector.timestampMs),
						source: algorandTealProgramTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
