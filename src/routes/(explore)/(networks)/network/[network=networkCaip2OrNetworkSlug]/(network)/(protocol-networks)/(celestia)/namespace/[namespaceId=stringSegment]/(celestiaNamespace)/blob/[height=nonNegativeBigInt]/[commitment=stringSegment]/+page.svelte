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

	const pageSelection = $derived(select(EntityType.CelestiaBlob, {
		$namespace: data.selector,
		height: BigInt(params.height),
		commitment: params.commitment,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaBlobView from '$/views/CelestiaBlobView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.commitment || 'celestia blob')} • celestia blob • Blockhead</title>
</svelte:head>


<Page>
	<CelestiaBlobView
		selection={pageSelection}
	/>
</Page>
