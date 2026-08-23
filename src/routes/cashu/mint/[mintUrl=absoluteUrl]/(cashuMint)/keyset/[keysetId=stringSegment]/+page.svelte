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
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CashuKeyset, data.selector, {
				sources: [
					Source.CashuMint_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.keysetId || 'Cashu keyset')} • Cashu keyset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cashu keyset'} • Cashu keyset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CashuKeyset, data.selector, {
				sources: [
					Source.CashuMint_Rest,
				],
			})}

	<CashuKeysetView
		selection={pageSelection}
	/>
	{/if}
</Page>
