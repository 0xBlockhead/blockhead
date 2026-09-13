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
	}: EntityListViewProps<EntityType.HederaAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				balanceTinybar: true,
				source: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaAccountTimestamp })}
		{@const hederaAccountTimestampSelector = hederaAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = hederaAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.HederaAccount_Timestamp}
			entitySelector={hederaAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.accountId,
						timestampMs: String(hederaAccountTimestampSelector.timestampMs),
						source: hederaAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{String(hederaAccountTimestamp.balanceTinybar ?? '') || 'hedera account timestamp'}
			{/snippet}

			{#snippet Value()}
				{hederaAccountTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaAccountTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
