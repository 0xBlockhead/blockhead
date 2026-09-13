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
	}: EntityListViewProps<EntityType.TransferRestrictionCheck_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TransferRestrictionCheck_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: transferRestrictionCheckTimestamp })}
		{@const transferRestrictionCheckTimestampSelector = transferRestrictionCheckTimestamp[EntityMetaKey.Selector]}
		{@const restriction = transferRestrictionCheckTimestampSelector.$restriction}
		<EntityView
			entityType={EntityType.TransferRestrictionCheck_Timestamp}
			entitySelector={transferRestrictionCheckTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/restriction/[restrictionKey=stringSegment]/[restrictionSource=stringSegment]/(transferRestriction)/subject/[subjectKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							restriction.$assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(restriction.$assetInstance.$network.caip2)
							:
								restriction.$assetInstance.$network.slug
						),
						kind: restriction.$assetInstance.kind,
						assetKey: restriction.$assetInstance.assetKey,
						restrictionKey: restriction.restrictionKey,
						restrictionSource: restriction.source,
						subjectKey: transferRestrictionCheckTimestampSelector.subjectKey,
						timestampMs: String(transferRestrictionCheckTimestampSelector.timestampMs),
						source: transferRestrictionCheckTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
