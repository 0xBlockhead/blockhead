<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebBlockView from '$/views/LitecoinMwebBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LitecoinMwebBlock, data.selector, {
					sources: [
						Source.LitecoinCore_JsonRpc,
					],
				}))}
			<title>{data?.title ?? 'litecoin MWEB block'} • litecoin MWEB block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'litecoin MWEB block'} • litecoin MWEB block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LitecoinMwebBlock, data.selector, {
					sources: [
						Source.LitecoinCore_JsonRpc,
					],
				}))}

		<LitecoinMwebBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
