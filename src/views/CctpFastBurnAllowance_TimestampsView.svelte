<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CctpFastBurnAllowance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpFastBurnAllowance_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				allowanceUsdc: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpFastBurnAllowanceTimestamp })}
		{@const cctpFastBurnAllowanceTimestampSelector = cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpFastBurnAllowance_Timestamp}
			entitySelector={cctpFastBurnAllowanceTimestampSelector}
			href={
				resolve(
					'/(assets)/cctp/allowance/[token=stringSegment]/(cctpAllowance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						token: cctpFastBurnAllowanceTimestampSelector.$allowance.token,
						timestampMs: String(cctpFastBurnAllowanceTimestampSelector.timestampMs),
						source: cctpFastBurnAllowanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cctpFastBurnAllowanceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{cctpFastBurnAllowanceTimestamp.allowanceUsdc}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cctpFastBurnAllowanceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
