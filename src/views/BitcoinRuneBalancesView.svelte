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
	}: EntityListViewProps<EntityType.BitcoinRuneBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRuneBalance}
	bind:open
	resource={
		selection({
			...{
				fields: {
					amount: true,
					$rune: {
						fields: {
							spacedRune: true,
							rune: true,
							number: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRuneBalance })}
		{@const bitcoinRuneBalanceSelector = bitcoinRuneBalance[EntityMetaKey.Selector]}
		{@const output = bitcoinRuneBalanceSelector.$output}
		{@const address = bitcoinRuneBalanceSelector.$address}
		<EntityView
			entityType={EntityType.BitcoinRuneBalance}
			entitySelector={bitcoinRuneBalanceSelector}
			href={
				'$output' in bitcoinRuneBalanceSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/rune/[runeId=stringSegment]',
						{
							network: (
								'caip2' in output.$transaction.$network ?
									caip2StringFromValue(output.$transaction.$network.caip2)
								:
									output.$transaction.$network.slug
							),
							transactionId: output.$transaction.txId,
							outputIndex: String(output.indexInTransaction),
							runeId: bitcoinRuneBalanceSelector.$rune.runeId,
						}
					)
				:
					'$address' in bitcoinRuneBalanceSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/rune/[runeId=stringSegment]',
							{
								network: (
									'caip2' in address.$network ?
										caip2StringFromValue(address.$network.caip2)
									:
										address.$network.slug
								),
								address: address.address,
								runeId: bitcoinRuneBalanceSelector.$rune.runeId,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{bitcoinRuneBalance.amount || 'Bitcoin Rune balance'}
			{/snippet}

			{#snippet Value()}
				{[(bitcoinRuneBalance.$rune.spacedRune ?? ''), (bitcoinRuneBalance.$rune.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
