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
	}: EntityListViewProps<EntityType.ZeroGServiceRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGServiceRequest}
	bind:open
	resource={
		selection({
			fields: {
				requestId: true,
				$serviceProvider: true,
				$requester: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGServiceRequest })}
		{@const zeroGServiceRequestSelector = zeroGServiceRequest[EntityMetaKey.Selector]}
		{@const serviceProvider = zeroGServiceRequestSelector.$serviceProvider}
		<EntityView
			entityType={EntityType.ZeroGServiceRequest}
			entitySelector={zeroGServiceRequestSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]/(zeroGServiceProvider)/request/[requestId=stringSegment]',
					{
						network: (
							'caip2' in serviceProvider.$network ?
								caip2StringFromValue(serviceProvider.$network.caip2)
							:
								serviceProvider.$network.slug
						),
						providerId: serviceProvider.providerId,
						requestId: zeroGServiceRequestSelector.requestId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGServiceRequestSelector.requestId || 'zero g service request'}
			{/snippet}

			{#snippet Value()}
				{zeroGServiceRequestSelector.$serviceProvider.providerId || 'zero g service provider'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGServiceRequest.$requester == null ? '' : zeroGServiceRequest.$requester.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
