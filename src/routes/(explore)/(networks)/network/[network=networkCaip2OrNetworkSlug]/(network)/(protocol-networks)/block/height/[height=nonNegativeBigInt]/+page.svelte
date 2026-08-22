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

	const pageSelection = $derived(select(EntityType.AptosBlock, {
		$network: data.selector,
		height: BigInt(params.height),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosBlockView from '$/views/AptosBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.height) || 'aptos block')} • aptos block • Blockhead</title>
</svelte:head>


<Page>
	<AptosBlockView
		selection={pageSelection}
	/>
</Page>
