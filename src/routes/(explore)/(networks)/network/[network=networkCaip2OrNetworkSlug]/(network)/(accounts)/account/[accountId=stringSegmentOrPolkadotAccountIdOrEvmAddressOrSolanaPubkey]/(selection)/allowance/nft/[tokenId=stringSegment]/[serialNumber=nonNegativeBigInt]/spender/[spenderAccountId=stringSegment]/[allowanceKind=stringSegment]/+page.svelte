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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaAllowance, {
		$owner: data.selector,
		$spender: {
			$network: data.selector.$network,
			accountId: params.spenderAccountId,
		},
		allowanceKind: params.allowanceKind,
		tokenId: params.tokenId,
		serialNumber: BigInt(params.serialNumber),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaAllowanceView from '$/views/HederaAllowanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.allowanceKind || 'hedera allowance')} • hedera allowance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera allowance'} • hedera allowance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaAllowanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
