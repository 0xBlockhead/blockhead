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

	const pageSelection = $derived(select(EntityType.CashuKeyset, data.selector, {
		sources: [
			Source.CashuMint_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.keysetId || 'Cashu keyset')} • Cashu keyset • Blockhead</title>
</svelte:head>


<Page>
	<CashuKeysetView
		selection={pageSelection}
	/>
</Page>
