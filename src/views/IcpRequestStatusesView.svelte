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
		id = 'IcpRequestStatuses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IcpRequestStatus> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpRequestStatus}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpRequestStatus })}
		{@const icpRequestStatusSelector = icpRequestStatus[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpRequestStatus}
			entitySelector={icpRequestStatusSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/request/[requestId=stringSegment]',
					{
						network: (
							icpRequestStatusSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(icpRequestStatusSelector.$network.$network.caip2)
							:
								icpRequestStatusSelector.$network.$network.slug
						),
						requestId: icpRequestStatusSelector.requestId,
					}
				)
			}
		>
			{#snippet Title()}
				ICP request status
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
