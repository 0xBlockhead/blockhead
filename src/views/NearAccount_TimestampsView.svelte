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
	}: EntityListViewProps<EntityType.NearAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccount_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					amountYoctoNear: true,
					blockHeight: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearAccountTimestamp })}
		{@const nearAccountTimestampSelector = nearAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = nearAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.NearAccount_Timestamp}
			entitySelector={nearAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.accountId,
						timestampMs: String(nearAccountTimestampSelector.timestampMs),
						source: nearAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{nearAccountTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{nearAccountTimestamp.amountYoctoNear ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccountTimestamp.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
