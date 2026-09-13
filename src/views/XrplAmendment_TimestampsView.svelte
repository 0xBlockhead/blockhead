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
	}: EntityListViewProps<EntityType.XrplAmendment_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmendment_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmendmentTimestamp })}
		{@const xrplAmendmentTimestampSelector = xrplAmendmentTimestamp[EntityMetaKey.Selector]}
		{@const amendment = xrplAmendmentTimestampSelector.$amendment}
		<EntityView
			entityType={EntityType.XrplAmendment_Timestamp}
			entitySelector={xrplAmendmentTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]/(xrplAmendment)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							amendment.$network.caip2 !== undefined ?
								caip2StringFromValue(amendment.$network.caip2)
							:
								amendment.$network.slug
						),
						amendmentId: amendment.amendmentId,
						ledgerIndex: String(xrplAmendmentTimestampSelector.ledgerIndex),
						source: xrplAmendmentTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL amendment timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
