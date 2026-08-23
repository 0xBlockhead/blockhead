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
	import BitcoinMiningPoolView from '$/views/BitcoinMiningPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinMiningPool, data.selector, {
					sources: [
						Source.MempoolSpace_Rest,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin mining pool' : pageSelection.entity.name || 'Bitcoin mining pool')} • Bitcoin mining pool • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin mining pool'} • Bitcoin mining pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinMiningPool, data.selector, {
					sources: [
						Source.MempoolSpace_Rest,
					],
					fields: {
						name: true,
					},
				}))}

		<BitcoinMiningPoolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
