<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CashuMint, data.selector, {
		sources: [
			Source.CashuMint_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.mintUrl || 'Cashu mint')} • Cashu mint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cashu mint'} • Cashu mint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CashuMintView
		selection={pageSelection}
	/>
	{/if}
</Page>
