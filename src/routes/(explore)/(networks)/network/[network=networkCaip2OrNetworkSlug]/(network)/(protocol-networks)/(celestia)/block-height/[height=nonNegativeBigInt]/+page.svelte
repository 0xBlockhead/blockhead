<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CelestiaBlock, {
		$network: data.selector,
		height: BigInt(params.height),
	}, {
		fields: {
			hash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlockView from '$/views/CelestiaBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.height ?? '') || 'celestia block' : String(pageSelection.entitySelector.height) || pageSelection.entity.hash || 'celestia block')} • celestia block • Blockhead</title>
</svelte:head>


<Page>
	<CelestiaBlockView
		selection={pageSelection}
	/>
</Page>
