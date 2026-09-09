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
	}: EntityListViewProps<EntityType.NearAccessKey_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccessKey_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				permission: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccessKeyTimestamp })}
		{@const nearAccessKeyTimestampSelector = nearAccessKeyTimestamp[EntityMetaKey.Selector]}
		{@const accessKey = nearAccessKeyTimestampSelector.$accessKey}
		<EntityView
			entityType={EntityType.NearAccessKey_Timestamp}
			entitySelector={nearAccessKeyTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/access-key/[publicKey=stringSegment]/(nearAccessKey)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in accessKey.$account.$network ?
								caip2StringFromValue(accessKey.$account.$network.caip2)
							:
								accessKey.$account.$network.slug
						),
						accountId: accessKey.$account.accountId,
						publicKey: accessKey.publicKey,
						timestampMs: String(nearAccessKeyTimestampSelector.timestampMs),
						source: nearAccessKeyTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{nearAccessKeyTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{nearAccessKeyTimestamp.permission ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccessKeyTimestamp.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
