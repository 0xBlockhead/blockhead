<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmLog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
		<p>
			Each row is one <code>LOG</code> opcode captured on the parent transaction receipt: emitter address, topics, and data payload.
	</p>

	<p>
		Topic 0 often fingerprints an ABI log declaration; additional topics carry indexed arguments when the emitter used ABI-style indexing.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmLog}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInTransaction: true,
				data: true,
			},
		})
	}
>
	{#snippet Item({ item: evmLog })}
		{@const evmLogSelector = evmLog[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmLog}
			entitySelector={evmLogSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]',
					{
						network: (
							'caip2' in evmLogSelector.$transaction.$network ?
								String(caip2StringFromValue(evmLogSelector.$transaction.$network.caip2))
							:
								String(evmLogSelector.$transaction.$network.slug)
						),
						transactionId: String(evmLogSelector.$transaction.txHash),
						indexInTransaction: String(evmLogSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(evmLogSelector.indexInTransaction ?? '') ? 'Log #' + String(evmLogSelector.indexInTransaction ?? '') : '') || ([(String(evmLogSelector.indexInTransaction) ? 'Log #' + String(evmLogSelector.indexInTransaction) : ''), String(evmLog.data ?? '')].filter(Boolean).join(' ')) || (String(evmLogSelector.indexInTransaction) ? '#' + String(evmLogSelector.indexInTransaction) : '') || 'EVM log'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
