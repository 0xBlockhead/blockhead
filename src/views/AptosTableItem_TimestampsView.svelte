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
	}: EntityListViewProps<EntityType.AptosTableItem_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTableItem_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				ledgerVersion: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTableItemTimestamp })}
		{@const aptosTableItemTimestampSelector = aptosTableItemTimestamp[EntityMetaKey.Selector]}
		{@const tableItem = aptosTableItemTimestampSelector.$tableItem}
		<EntityView
			entityType={EntityType.AptosTableItem_Timestamp}
			entitySelector={aptosTableItemTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(aptos)/table-item/[tableHandle=stringSegment]/[keyHash=stringSegment]/(aptosTableItem)/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							tableItem.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(tableItem.$network.$network.caip2)
							:
								tableItem.$network.$network.slug
						),
						tableHandle: tableItem.tableHandle,
						keyHash: tableItem.keyHash,
						ledgerVersion: String(aptosTableItemTimestampSelector.ledgerVersion),
						source: aptosTableItemTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosTableItemTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{aptosTableItemTimestamp.timestampMs ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosTableItemTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
