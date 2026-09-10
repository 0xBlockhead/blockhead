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
	}: EntityListViewProps<EntityType.AptosAccountResource_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccountResource_Timestamp}
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
	{#snippet Item({ item: aptosAccountResourceTimestamp })}
		{@const aptosAccountResourceTimestampSelector = aptosAccountResourceTimestamp[EntityMetaKey.Selector]}
		{@const resource = aptosAccountResourceTimestampSelector.$resource}
		<EntityView
			entityType={EntityType.AptosAccountResource_Timestamp}
			entitySelector={aptosAccountResourceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/resource/[resourceType=stringSegment]/(aptosAccountResource)/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in resource.$account.$network.$network ?
								caip2StringFromValue(resource.$account.$network.$network.caip2)
							:
								resource.$account.$network.$network.slug
						),
						accountId: resource.$account.address,
						resourceType: resource.resourceType,
						ledgerVersion: String(aptosAccountResourceTimestampSelector.ledgerVersion),
						source: aptosAccountResourceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosAccountResourceTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{aptosAccountResourceTimestamp.timestampMs ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosAccountResourceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
