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
		title = 'Account snapshots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosAccount_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				accountNumber: true,
				sequence: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosAccountTimestamp })}
		{@const cosmosAccountTimestampSelector = cosmosAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = cosmosAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.CosmosAccount_Timestamp}
			entitySelector={cosmosAccountTimestampSelector}
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
						accountId: account.address,
						timestampMs: String(cosmosAccountTimestampSelector.timestampMs),
						source: cosmosAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosAccountTimestampSelector.source || 'Cosmos account timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(cosmosAccountTimestamp.accountNumber ?? ''), String(cosmosAccountTimestamp.sequence ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosAccountTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
