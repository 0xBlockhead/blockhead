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
	}: EntityListViewProps<EntityType.XrplAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				balanceDrops: true,
				source: true,
				ledgerIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: xrplAccountTimestamp })}
		{@const xrplAccountTimestampSelector = xrplAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = xrplAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.XrplAccount_Timestamp}
			entitySelector={xrplAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/xrpl-ledger/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.account,
						ledgerIndex: String(xrplAccountTimestampSelector.ledgerIndex),
						source: xrplAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{String(xrplAccountTimestamp.balanceDrops ?? '') || 'XRPL account timestamp'}
			{/snippet}

			{#snippet Value()}
				{xrplAccountTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xrplAccountTimestampSelector.ledgerIndex}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
