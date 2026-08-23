<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HederaTokenCustomFeeView from '$/views/HederaTokenCustomFeeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTokenCustomFee, {
					$tokenTimestamp: data.selector,
					feeIndex: Number(params.feeIndex),
				}))}
			<title>{data?.title ?? 'hedera token custom fee'} • hedera token custom fee • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera token custom fee'} • hedera token custom fee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaTokenCustomFee, {
					$tokenTimestamp: data.selector,
					feeIndex: Number(params.feeIndex),
				}))}

		<HederaTokenCustomFeeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
