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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmContractSourceBundle, {
					$contract: data.selector,
				}))}
			<title>{data?.title ?? 'EVM contract source bundle'} • EVM contract source bundle • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM contract source bundle'} • EVM contract source bundle • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmContractSourceBundle, {
					$contract: data.selector,
				}))}

		<EvmContractSourceBundleView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
