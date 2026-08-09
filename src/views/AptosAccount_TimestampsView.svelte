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
	}: EntityListViewProps<EntityType.AptosAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccount_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					ledgerVersion: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aptosAccountTimestamp })}
		{@const aptosAccountTimestampSelector = aptosAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = aptosAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.AptosAccount_Timestamp}
			entitySelector={aptosAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/aptos-ledger/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network.$network ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.address,
						ledgerVersion: String(aptosAccountTimestampSelector.ledgerVersion),
						source: aptosAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosAccountTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{aptosAccountTimestamp.timestampMs ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosAccountTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
