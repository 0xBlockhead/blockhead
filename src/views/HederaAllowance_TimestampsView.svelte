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
	}: EntityListViewProps<EntityType.HederaAllowance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAllowance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaAllowanceTimestamp })}
		{@const hederaAllowanceTimestampSelector = hederaAllowanceTimestamp[EntityMetaKey.Selector]}
		{@const allowance = hederaAllowanceTimestampSelector.$allowance}
		<EntityView
			entityType={EntityType.HederaAllowance_Timestamp}
			entitySelector={hederaAllowanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]/(hederaAllowance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in allowance.$owner.$network ?
								caip2StringFromValue(allowance.$owner.$network.caip2)
							:
								allowance.$owner.$network.slug
						),
						accountId: allowance.$owner.accountId,
						spenderAccountId: allowance.$spender.accountId,
						allowanceKind: allowance.allowanceKind,
						timestampMs: String(hederaAllowanceTimestampSelector.timestampMs),
						source: hederaAllowanceTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
