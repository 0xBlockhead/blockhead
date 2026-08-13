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
		title = 'Balancer pool activity',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BalancerPoolEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerPoolEvent}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					eventType: true,
					valueUsd: true,
					$pool: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: balancerPoolEvent })}
		{@const balancerPoolEventSelector = balancerPoolEvent[EntityMetaKey.Selector]}
		{@const pool = balancerPoolEventSelector.$pool}
		<EntityView
			entityType={EntityType.BalancerPoolEvent}
			entitySelector={balancerPoolEventSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/event/[eventId=stringSegment]',
					{
						network: (
							'caip2' in pool.$network ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						eventId: encodeURIComponent(balancerPoolEventSelector.eventId),
					}
				)
			}
		>
			{#snippet Title()}
				{balancerPoolEvent.eventType || 'Balancer pool event'}
			{/snippet}

			{#snippet Value()}
				{balancerPoolEvent.valueUsd}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerPoolEvent.$pool.name || 'Balancer pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
