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
	}: EntityListViewProps<EntityType.ZeroGSettlementTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGSettlementTrace}
	bind:open
	resource={
		selection({
			fields: {
				traceId: true,
				$serviceRequest: true,
				settlementTransactionHash: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGSettlementTrace })}
		{@const zeroGSettlementTraceSelector = zeroGSettlementTrace[EntityMetaKey.Selector]}
		{@const serviceRequest = zeroGSettlementTraceSelector.$serviceRequest}
		<EntityView
			entityType={EntityType.ZeroGSettlementTrace}
			entitySelector={zeroGSettlementTraceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]/(zeroGServiceProvider)/request/[requestId=stringSegment]/(zeroGServiceRequest)/trace/[traceId=stringSegment]',
					{
						network: (
							serviceRequest.$serviceProvider.$network.caip2 !== undefined ?
								caip2StringFromValue(serviceRequest.$serviceProvider.$network.caip2)
							:
								serviceRequest.$serviceProvider.$network.slug
						),
						providerId: serviceRequest.$serviceProvider.providerId,
						requestId: serviceRequest.requestId,
						traceId: zeroGSettlementTraceSelector.traceId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGSettlementTraceSelector.traceId || 'zero g settlement trace'}
			{/snippet}

			{#snippet Value()}
				{zeroGSettlementTraceSelector.$serviceRequest.requestId || 'zero g service request'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGSettlementTrace.settlementTransactionHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
