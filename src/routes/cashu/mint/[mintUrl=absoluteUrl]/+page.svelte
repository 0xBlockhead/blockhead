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


	// Components
	import Page from '$/components/Page.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CashuMint, data.selector, {
				sources: [
					Source.CashuMint_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.mintUrl || 'Cashu mint')} • Cashu mint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cashu mint'} • Cashu mint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CashuMint, data.selector, {
				sources: [
					Source.CashuMint_Rest,
				],
			})}

	<CashuMintView
		selection={pageSelection}
	/>
	{/if}
</Page>
