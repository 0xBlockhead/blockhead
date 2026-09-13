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
	}: EntityListViewProps<EntityType.IcpRequestStatus_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpRequestStatus_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpRequestStatusTimestamp })}
		{@const icpRequestStatusTimestampSelector = icpRequestStatusTimestamp[EntityMetaKey.Selector]}
		{@const requestStatus = icpRequestStatusTimestampSelector.$requestStatus}
		<EntityView
			entityType={EntityType.IcpRequestStatus_Timestamp}
			entitySelector={icpRequestStatusTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/request/[requestId=stringSegment]/(icpRequestStatus)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							requestStatus.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(requestStatus.$network.$network.caip2)
							:
								requestStatus.$network.$network.slug
						),
						requestId: requestStatus.requestId,
						timestampMs: String(icpRequestStatusTimestampSelector.timestampMs),
						source: icpRequestStatusTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP request status timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
