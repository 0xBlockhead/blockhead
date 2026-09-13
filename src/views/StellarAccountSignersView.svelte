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
	}: EntityListViewProps<EntityType.StellarAccountSigner> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccountSigner}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccountSigner })}
		{@const stellarAccountSignerSelector = stellarAccountSigner[EntityMetaKey.Selector]}
		{@const account = stellarAccountSignerSelector.$account}
		<EntityView
			entityType={EntityType.StellarAccountSigner}
			entitySelector={stellarAccountSignerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/signer/[signerKey=stringSegment]/[signerType=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.accountId,
						signerKey: stellarAccountSignerSelector.signerKey,
						signerType: stellarAccountSignerSelector.signerType,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
