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
	}: EntityListViewProps<EntityType.HederaAllowance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaAllowance}
	bind:open
	resource={
		selection({
			...{
				fields: {
					allowanceKind: true,
					$spender: true,
					$token: true,
					serialNumber: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hederaAllowance })}
		{@const hederaAllowanceSelector = hederaAllowance[EntityMetaKey.Selector]}
		{@const owner = hederaAllowanceSelector.$owner}
		<EntityView
			entityType={EntityType.HederaAllowance}
			entitySelector={hederaAllowanceSelector}
			href={
				'tokenId' in hederaAllowanceSelector
				&& 'serialNumber' in hederaAllowanceSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/nft/[tokenId=stringSegment]/[serialNumber=nonNegativeBigInt]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
						{
							network: (
								'caip2' in owner.$network ?
									caip2StringFromValue(owner.$network.caip2)
								:
									owner.$network.slug
							),
							accountId: owner.accountId,
							tokenId: hederaAllowanceSelector.tokenId,
							serialNumber: String(hederaAllowanceSelector.serialNumber),
							spenderAccountId: hederaAllowanceSelector.$spender.accountId,
							allowanceKind: hederaAllowanceSelector.allowanceKind,
						}
					)
				:
					'tokenId' in hederaAllowanceSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/token/[tokenId=stringSegment]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
							{
								network: (
									'caip2' in owner.$network ?
										caip2StringFromValue(owner.$network.caip2)
									:
										owner.$network.slug
								),
								accountId: owner.accountId,
								tokenId: hederaAllowanceSelector.tokenId,
								spenderAccountId: hederaAllowanceSelector.$spender.accountId,
								allowanceKind: hederaAllowanceSelector.allowanceKind,
							}
						)
					:
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
							{
								network: (
									'caip2' in owner.$network ?
										caip2StringFromValue(owner.$network.caip2)
									:
										owner.$network.slug
								),
								accountId: owner.accountId,
								spenderAccountId: hederaAllowanceSelector.$spender.accountId,
								allowanceKind: hederaAllowanceSelector.allowanceKind,
							}
						)
			}
		>
			{#snippet Title()}
				{hederaAllowanceSelector.allowanceKind || 'hedera allowance'}
			{/snippet}

			{#snippet Value()}
				{hederaAllowanceSelector.$spender.accountId || 'hedera account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[hederaAllowance.$token == null ? '' : hederaAllowance.$token.tokenId || 'hedera token', String(hederaAllowance.serialNumber)].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
