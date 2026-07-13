<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


{#key [params.network, params.transactionId].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				network: params.network,
				transactionId: params.transactionId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.selectorMapping.entityType === EntityType.EvmTransaction ? EvmTransactionView : data.selectorMapping.entityType === EntityType.SolanaTransaction ? SolanaTransactionView : UtxoTransactionView}

			<DetailView
				selection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
						network: params.network,
						transactionId: params.transactionId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
