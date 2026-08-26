<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NearAccount_Block, {
		$account: data.selector,
		$block: {
			$network: data.selector.$network,
			height: BigInt(params.blockHeight),
			hash: params.blockHash,
		},
	}, {
		sources: [
			Source.NearRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearAccount_BlockView from '$/views/NearAccount_BlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'near account block state'} • near account block state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near account block state'} • near account block state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NearAccount_BlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
