<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SolanaInstruction, data.selector, {
		fields: {
			parsedType: true,
			stackHeight: true,
			$program: true,
			data: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? 'solana instruction' : 'solana instruction')))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • solana instruction • Blockhead</title>
</svelte:head>


<Page>
	<SolanaInstructionView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				instructionKind: params.instructionKind,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={pageSelection}
	/>
</Page>
