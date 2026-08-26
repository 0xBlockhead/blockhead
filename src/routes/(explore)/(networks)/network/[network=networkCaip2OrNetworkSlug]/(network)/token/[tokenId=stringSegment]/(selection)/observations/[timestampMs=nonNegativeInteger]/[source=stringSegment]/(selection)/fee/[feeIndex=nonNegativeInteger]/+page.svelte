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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaTokenCustomFee, {
		$tokenTimestamp: data.selector,
		feeIndex: Number(params.feeIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTokenCustomFeeView from '$/views/HederaTokenCustomFeeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera token custom fee'} • hedera token custom fee • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera token custom fee'} • hedera token custom fee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaTokenCustomFeeView
		selection={pageSelection}
	/>
	{/if}
</Page>
