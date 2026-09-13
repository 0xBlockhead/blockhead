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
	}: EntityListViewProps<EntityType.EvmRollup_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmRollup_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				listingStage: true,
				timestampMs: true,
				$rollup: true,
			},
		})
	}
>
	{#snippet Item({ item: evmRollupTimestamp })}
		{@const evmRollupTimestampSelector = evmRollupTimestamp[EntityMetaKey.Selector]}
		{@const rollup = evmRollupTimestampSelector.$rollup}
		<EntityView
			entityType={EntityType.EvmRollup_Timestamp}
			entitySelector={evmRollupTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							rollup.$network.caip2 !== undefined ?
								caip2StringFromValue(rollup.$network.caip2)
							:
								rollup.$network.slug
						),
						projectId: rollup.projectId,
						timestampMs: String(evmRollupTimestampSelector.timestampMs),
						source: evmRollupTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(evmRollupTimestamp.listingStage ?? ''), String(evmRollupTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'EVM rollup timestamp'}
			{/snippet}

			{#snippet Value()}
				{evmRollupTimestamp.listingStage ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(evmRollupTimestamp.$rollup.name ?? ''), evmRollupTimestampSelector.$rollup.projectId].filter(Boolean).join(' ') || 'EVM rollup'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
