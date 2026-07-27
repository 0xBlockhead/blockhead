<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmInternalTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
		<p>
			Native currency sent by internal <code>CALL</code> frames during execution, distinct from the signed envelope <code>value</code>.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmInternalTransfer}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInTransaction: true,
				callType: true,
				value: true,
				success: true,
			},
		})
	}
>
	{#snippet Item({ item: evmInternalTransfer })}
		{@const evmInternalTransferSelector = evmInternalTransfer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmInternalTransfer}
			entitySelector={evmInternalTransferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]',
					{
						network: (
							'caip2' in evmInternalTransferSelector.$transaction.$network ?
								String(caip2StringFromValue(evmInternalTransferSelector.$transaction.$network.caip2))
							:
								String(evmInternalTransferSelector.$transaction.$network.slug)
						),
						transactionId: String(evmInternalTransferSelector.$transaction.txHash),
						indexInTransaction: String(evmInternalTransferSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(evmInternalTransferSelector.indexInTransaction ?? '') ? 'Internal #' + String(evmInternalTransferSelector.indexInTransaction ?? '') : '') || ([(String(evmInternalTransferSelector.indexInTransaction) ? 'Internal #' + String(evmInternalTransferSelector.indexInTransaction) : ''), evmInternalTransfer.callType, String(evmInternalTransfer.value)].filter(Boolean).join(' ')) || (String(evmInternalTransferSelector.indexInTransaction) ? '#' + String(evmInternalTransferSelector.indexInTransaction) : '') || 'EVM internal transfer'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(evmInternalTransfer.success ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
