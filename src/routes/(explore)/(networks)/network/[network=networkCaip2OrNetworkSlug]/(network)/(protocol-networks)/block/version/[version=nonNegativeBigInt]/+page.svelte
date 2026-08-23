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
	import AptosBlockView from '$/views/AptosBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosBlock, {
					$network: data.selector,
					version: BigInt(params.version),
				}, {
					fields: {
						height: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'aptos block' : String(pageSelection.entity.height) || 'aptos block')} • aptos block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'aptos block'} • aptos block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AptosBlock, {
					$network: data.selector,
					version: BigInt(params.version),
				}, {
					fields: {
						height: true,
					},
				}))}

		<AptosBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
