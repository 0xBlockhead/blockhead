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
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


{#key [params.network, params.transactionId, params.outputIndex].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				outputIndex: params.outputIndex,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = UtxoOutputView}

			<DetailView
				selection={select(EntityType.UtxoOutput, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
						network: params.network,
						transactionId: params.transactionId,
						outputIndex: params.outputIndex,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
