<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title = 'Account snapshots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAccount_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				freeBalancePlancks: true,
				nonce: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotAccountTimestamp })}
		{@const polkadotAccountTimestampSelector = polkadotAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotAccount_Timestamp}
			entitySelector={polkadotAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in polkadotAccountTimestampSelector.$account.$network ?
								String(caip2StringFromValue(polkadotAccountTimestampSelector.$account.$network.caip2))
							:
								String(polkadotAccountTimestampSelector.$account.$network.slug)
						),
						accountId: String(polkadotAccountTimestampSelector.$account.accountId),
						timestampMs: String(polkadotAccountTimestampSelector.timestampMs),
						source: String(polkadotAccountTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotAccountTimestampSelector.source || 'Polkadot account timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(polkadotAccountTimestamp.freeBalancePlancks ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(polkadotAccountTimestamp.nonce ?? ''), String(polkadotAccountTimestampSelector.timestampMs)].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
