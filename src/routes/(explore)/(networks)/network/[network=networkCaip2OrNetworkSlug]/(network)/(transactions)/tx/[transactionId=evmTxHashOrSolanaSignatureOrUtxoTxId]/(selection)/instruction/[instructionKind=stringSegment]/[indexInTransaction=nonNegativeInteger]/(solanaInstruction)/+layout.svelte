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
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


{#key [params.network, params.transactionId, params.instructionKind, params.indexInTransaction].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				instructionKind: params.instructionKind,
				indexInTransaction: params.indexInTransaction,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = SolanaInstructionView}

			<DetailView
				selection={select(EntityType.SolanaInstruction, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
						network: params.network,
						transactionId: params.transactionId,
						instructionKind: params.instructionKind,
						indexInTransaction: params.indexInTransaction,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
