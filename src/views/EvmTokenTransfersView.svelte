<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTokenStandard } from '$/constants/Evm.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmTokenTransfer> = $props()


	// Components
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-20, ERC-721, and ERC-1155 movements indexed from receipt logs on this transaction.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTokenTransfer}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInLog: true,
				standard: true,
				amount: true,
				tokenSymbol: true,
			},
			limit: 64,
		})
	}
>
	{#snippet Item({ item: evmTokenTransfer })}
		{@const evmTokenTransferSelector = evmTokenTransfer[EntityMetaKey.Selector]}
		{@const selection = select(EntityType.EvmTokenTransfer, evmTokenTransferSelector)}
		<ProjectionBoundary
			resource={selection.Nft}
		>
			{#snippet Applicable(evmTokenTransferProjection0)}
				<ResourceBoundary
					resource={evmTokenTransferProjection0.tokenId}
				>
					{#snippet children(nftTokenId0)}
						<EntityView
							entityType={EntityType.EvmTokenTransfer}
							entitySelector={evmTokenTransferSelector}
							href={
								resolve(
									'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]',
									{
										network: (
											'caip2' in evmTokenTransferSelector.$log.$transaction.$network ?
												String(caip2StringFromValue(evmTokenTransferSelector.$log.$transaction.$network.caip2))
											:
												String(evmTokenTransferSelector.$log.$transaction.$network.slug)
										),
										transactionId: String(evmTokenTransferSelector.$log.$transaction.txHash),
										indexInTransaction: String(evmTokenTransferSelector.$log.indexInTransaction),
										transferIndex: String(evmTokenTransferSelector.indexInLog),
									}
								)
							}
						>
							{#snippet Title()}
								{(String(evmTokenTransferSelector.indexInLog ?? '') ? 'Transfer #' + String(evmTokenTransferSelector.indexInLog ?? '') : '') || ([(String(evmTokenTransferSelector.indexInLog) ? 'Transfer #' + String(evmTokenTransferSelector.indexInLog) : ''), evmTokenTransfer.standard, String(evmTokenTransfer.amount)].filter(Boolean).join(' ')) || (String(evmTokenTransferSelector.indexInLog) ? '#' + String(evmTokenTransferSelector.indexInLog) : '') || 'Token transfer'}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{[(evmTokenTransfer.tokenSymbol ?? ''), String(nftTokenId0 ?? '')].filter(Boolean).join(' ')}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
