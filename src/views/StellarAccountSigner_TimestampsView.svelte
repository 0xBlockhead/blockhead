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
	}: EntityListViewProps<EntityType.StellarAccountSigner_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccountSigner_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccountSignerTimestamp })}
		{@const stellarAccountSignerTimestampSelector = stellarAccountSignerTimestamp[EntityMetaKey.Selector]}
		{@const signer = stellarAccountSignerTimestampSelector.$signer}
		<EntityView
			entityType={EntityType.StellarAccountSigner_Timestamp}
			entitySelector={stellarAccountSignerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/signer/[signerKey=stringSegment]/[signerType=stringSegment]/(stellarAccountSigner)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in signer.$account.$network.$network ?
								caip2StringFromValue(signer.$account.$network.$network.caip2)
							:
								signer.$account.$network.$network.slug
						),
						accountId: signer.$account.accountId,
						signerKey: signer.signerKey,
						signerType: signer.signerType,
						timestampMs: String(stellarAccountSignerTimestampSelector.timestampMs),
						source: stellarAccountSignerTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
