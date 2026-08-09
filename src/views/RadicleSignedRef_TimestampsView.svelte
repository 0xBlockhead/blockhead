<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RadicleSignedRef_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleSignedRef_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleSignedRefTimestamp })}
		{@const radicleSignedRefTimestampSelector = radicleSignedRefTimestamp[EntityMetaKey.Selector]}
		{@const signedRef = radicleSignedRefTimestampSelector.$signedRef}
		<EntityView
			entityType={EntityType.RadicleSignedRef_Timestamp}
			entitySelector={radicleSignedRefTimestampSelector}
			href={
				resolve(
					'/radicle/repository/[rid=stringSegment]/(radicleRepository)/signed-ref/[nodeId=stringSegment]/[refName=stringSegment]/(radicleSignedRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						rid: signedRef.$repository.rid,
						nodeId: signedRef.nodeId,
						refName: signedRef.refName,
						timestampMs: String(radicleSignedRefTimestampSelector.timestampMs),
						source: radicleSignedRefTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
