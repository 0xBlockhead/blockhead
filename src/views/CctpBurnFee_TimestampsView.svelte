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
	}: EntityListViewProps<EntityType.CctpBurnFee_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpBurnFee_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$sourceDomain: {
						fields: {
							name: true,
						},
					},
					$destinationDomain: {
						fields: {
							name: true,
						},
					},
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cctpBurnFeeTimestamp })}
		{@const cctpBurnFeeTimestampSelector = cctpBurnFeeTimestamp[EntityMetaKey.Selector]}
		{@const sourceDomain = cctpBurnFeeTimestampSelector.$sourceDomain}
		<EntityView
			entityType={EntityType.CctpBurnFee_Timestamp}
			entitySelector={cctpBurnFeeTimestampSelector}
			href={
				resolve(
					'/cctp/version/[cctpVersion=nonNegativeInteger]/domain/[domainId=nonNegativeInteger]/(cctpDomainSupport)/burn-fee/[destinationDomain=nonNegativeInteger]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						cctpVersion: String(sourceDomain.cctpVersion),
						domainId: String(sourceDomain.domainId),
						destinationDomain: String(cctpBurnFeeTimestampSelector.$destinationDomain.domainId),
						timestampMs: String(cctpBurnFeeTimestampSelector.timestampMs),
						source: cctpBurnFeeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cctpBurnFeeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[cctpBurnFeeTimestamp.$sourceDomain.name || 'CCTP domain support', cctpBurnFeeTimestamp.$destinationDomain.name || 'CCTP domain support'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cctpBurnFeeTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
