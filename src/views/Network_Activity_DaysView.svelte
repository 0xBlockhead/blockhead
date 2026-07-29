<!-- Generated from APP.ts. Do not edit by hand. -->

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
		typeAnnotationParagraphs = ['A completed UTC day of provider-reported network activity aggregates.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Network_Activity_Day> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network_Activity_Day}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				dayStartTimestampMs: true,
				transactionCount: true,
				trustModel: true,
			},
		})
	}
>
	{#snippet Item({ item: networkActivityDay })}
		{@const networkActivityDaySelector = networkActivityDay[EntityMetaKey.Selector]}
		{@const network = networkActivityDaySelector.$network}
		<EntityView
			entityType={EntityType.Network_Activity_Day}
			entitySelector={networkActivityDaySelector}
			href={
				networkActivityDaySelector.source === 'SpaceAndTime_MakeInfinite' ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							dayStartTimestampMs: String(networkActivityDaySelector.dayStartTimestampMs),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{networkActivityDaySelector.dayStartTimestampMs}
			{/snippet}

			{#snippet Value()}
				{networkActivityDay.transactionCount}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{networkActivityDay.trustModel}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
