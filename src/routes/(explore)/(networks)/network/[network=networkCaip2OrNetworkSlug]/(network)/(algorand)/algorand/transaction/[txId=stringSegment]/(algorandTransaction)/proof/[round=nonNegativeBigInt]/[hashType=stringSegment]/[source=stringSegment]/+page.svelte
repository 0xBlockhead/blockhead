<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTransactionProofView from '$/views/AlgorandTransactionProofView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTransactionProof, {
				$transaction: data.selector,
				round: BigInt(params.round),
				hashType: params.hashType,
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'algorand transaction proof'} • algorand transaction proof • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand transaction proof'} • algorand transaction proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTransactionProof, {
				$transaction: data.selector,
				round: BigInt(params.round),
				hashType: params.hashType,
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<AlgorandTransactionProofView
		selection={pageSelection}
	/>
	{/if}
</Page>
