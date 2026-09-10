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
	}: EntityListViewProps<EntityType.NearAccount_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearAccount_Block}
	bind:open
	resource={
		selection({
			fields: {
				$block: {
					fields: {
						hash: true,
						timestampMs: true,
					},
				},
				amountYoctoNear: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: nearAccountBlock })}
		{@const nearAccountBlockSelector = nearAccountBlock[EntityMetaKey.Selector]}
		{@const account = nearAccountBlockSelector.$account}
		{@const block = nearAccountBlockSelector.$block}
		<EntityView
			entityType={EntityType.NearAccount_Block}
			entitySelector={nearAccountBlockSelector}
			href={
				'hash' in block ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/block-state/[blockHeight=nonNegativeBigInt]/[blockHash=stringSegment]',
						{
							network: (
								'caip2' in account.$network ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.accountId,
							blockHeight: String(block.height),
							blockHash: block.hash,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{String(nearAccountBlockSelector.$block.height) || 'near block'}
			{/snippet}

			{#snippet Value()}
				{nearAccountBlock.amountYoctoNear}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearAccountBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
