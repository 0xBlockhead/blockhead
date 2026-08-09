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

	const pageSelection = $derived(select(EntityType.CashuMint, data.selector, {
		sources: [
			Source.CashuMint_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.mintUrl || 'Cashu mint')} • Cashu mint • Blockhead</title>
</svelte:head>


<Page>
	<CashuMintView
		selection={pageSelection}
	/>
</Page>
