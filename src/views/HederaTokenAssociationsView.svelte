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
	}: EntityListViewProps<EntityType.HederaTokenAssociation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenAssociation}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$token: true,
					$account: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hederaTokenAssociation })}
		{@const hederaTokenAssociationSelector = hederaTokenAssociation[EntityMetaKey.Selector]}
		{@const account = hederaTokenAssociationSelector.$account}
		<EntityView
			entityType={EntityType.HederaTokenAssociation}
			entitySelector={hederaTokenAssociationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.accountId,
						tokenId: hederaTokenAssociationSelector.$token.tokenId,
					}
				)
			}
		>
			{#snippet Title()}
				{hederaTokenAssociationSelector.$token.tokenId || 'hedera token'}
			{/snippet}

			{#snippet Value()}
				{hederaTokenAssociationSelector.$account.accountId || 'hedera account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
