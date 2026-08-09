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
	}: EntityListViewProps<EntityType.CelestiaNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					latestHeight: true,
					health: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: celestiaNetworkTimestamp })}
		{@const celestiaNetworkTimestampSelector = celestiaNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNetwork_Timestamp}
			entitySelector={celestiaNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in celestiaNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(celestiaNetworkTimestampSelector.$network.$network.caip2)
							:
								celestiaNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(celestiaNetworkTimestampSelector.timestampMs),
						source: celestiaNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{celestiaNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(celestiaNetworkTimestamp.latestHeight ?? ''), (celestiaNetworkTimestamp.health ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{celestiaNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
