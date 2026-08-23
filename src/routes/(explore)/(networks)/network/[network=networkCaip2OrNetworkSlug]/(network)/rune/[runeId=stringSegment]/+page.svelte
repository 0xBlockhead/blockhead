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
	import BitcoinRuneView from '$/views/BitcoinRuneView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinRune, data.selector, {
					sources: [
						Source.UniSat_Rest,
					],
					fields: {
						spacedRune: true,
						rune: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Rune' : [(pageSelection.entity.spacedRune ?? ''), (pageSelection.entity.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune')} • Bitcoin Rune • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin Rune'} • Bitcoin Rune • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinRune, data.selector, {
					sources: [
						Source.UniSat_Rest,
					],
					fields: {
						spacedRune: true,
						rune: true,
					},
				}))}

		<BitcoinRuneView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
