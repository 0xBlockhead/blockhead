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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandTransactionProof, {
		$transaction: data.selector,
		round: BigInt(params.round),
		hashType: params.hashType,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTransactionProofView from '$/views/AlgorandTransactionProofView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand transaction proof'} • algorand transaction proof • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand transaction proof'} • algorand transaction proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandTransactionProofView
		selection={pageSelection}
	/>
	{/if}
</Page>
