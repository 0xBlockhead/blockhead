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
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenCommitment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	bind:open
	resource={
		selection({
			fields: {
				commitmentHex: true,
				$output: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenCommitment })}
		{@const bitcoinCashCashTokenCommitmentSelector = bitcoinCashCashTokenCommitment[EntityMetaKey.Selector]}
		{@const output = bitcoinCashCashTokenCommitmentSelector.$output}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCommitment}
			entitySelector={bitcoinCashCashTokenCommitmentSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-commitment',
					{
						network: (
							output.$transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(output.$transaction.$network.caip2)
							:
								output.$transaction.$network.slug
						),
						transactionId: output.$transaction.txId,
						outputIndex: String(output.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenCommitment.commitmentHex || 'Bitcoin Cash CashToken commitment'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenCommitment.commitmentHex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{`Output #${bitcoinCashCashTokenCommitmentSelector.$output.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
