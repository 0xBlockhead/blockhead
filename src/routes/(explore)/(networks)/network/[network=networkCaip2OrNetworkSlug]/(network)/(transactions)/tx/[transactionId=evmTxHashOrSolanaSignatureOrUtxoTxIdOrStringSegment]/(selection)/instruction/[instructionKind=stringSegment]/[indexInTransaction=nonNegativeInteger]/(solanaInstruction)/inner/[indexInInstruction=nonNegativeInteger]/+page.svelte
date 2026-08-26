<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SolanaInstruction, {
		$transaction: data.selector.$transaction,
		instructionKind: params.instructionKind,
		indexInTransaction: Number(params.indexInTransaction),
		indexInInstruction: Number(params.indexInInstruction),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'solana instruction'} • solana instruction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana instruction'} • solana instruction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SolanaInstructionView
		selection={pageSelection}
	/>
	{/if}
</Page>
