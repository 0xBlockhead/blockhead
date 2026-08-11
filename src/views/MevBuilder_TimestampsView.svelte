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
	}: EntityListViewProps<EntityType.MevBuilder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevBuilder_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: mevBuilderTimestamp })}
		{@const mevBuilderTimestampSelector = mevBuilderTimestamp[EntityMetaKey.Selector]}
		{@const builder = mevBuilderTimestampSelector.$builder}
		<EntityView
			entityType={EntityType.MevBuilder_Timestamp}
			entitySelector={mevBuilderTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in builder.$network ?
								caip2StringFromValue(builder.$network.caip2)
							:
								builder.$network.slug
						),
						builderPubkey: builder.builderPubkey,
						timestampMs: String(mevBuilderTimestampSelector.timestampMs),
						source: mevBuilderTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
