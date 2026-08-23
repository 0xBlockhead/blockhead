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
	import HederaContractLogView from '$/views/HederaContractLogView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaContractLog, {
					$result: data.selector,
					logIndex: Number(params.logIndex),
				}))}
			<title>{data?.title ?? 'hedera contract log'} • hedera contract log • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera contract log'} • hedera contract log • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaContractLog, {
					$result: data.selector,
					logIndex: Number(params.logIndex),
				}))}

		<HederaContractLogView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
