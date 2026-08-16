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

	const pageSelection = $derived(select(EntityType.BitcoinMiningPool, data.selector, {
		sources: [
			Source.MempoolSpace_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinMiningPoolView from '$/views/BitcoinMiningPoolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Bitcoin mining pool' : pageSelection.entity.name || 'Bitcoin mining pool')} • Bitcoin mining pool • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinMiningPoolView
		selection={pageSelection}
	/>
</Page>
