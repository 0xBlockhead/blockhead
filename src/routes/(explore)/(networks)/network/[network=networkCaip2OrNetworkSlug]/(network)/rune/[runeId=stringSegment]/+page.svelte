<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinRune, data.selector, {
		sources: [
			Source.UniSat_Rest,
		],
		fields: {
			spacedRune: true,
			rune: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinRuneView from '$/views/BitcoinRuneView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Rune' : [(pageSelection.entity.spacedRune ?? ''), (pageSelection.entity.rune ?? '')].filter(Boolean).join(' ') || 'Bitcoin Rune')} • Bitcoin Rune • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Rune'} • Bitcoin Rune • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinRuneView
		selection={pageSelection}
	/>
	{/if}
</Page>
