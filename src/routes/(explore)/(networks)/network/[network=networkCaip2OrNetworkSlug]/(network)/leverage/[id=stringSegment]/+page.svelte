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

	const pageSelection = $derived(select(EntityType.Leverage, {
		$network: data.selector,
		id: params.id,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.id || 'leverage')} • leverage • Blockhead</title>
</svelte:head>


<Page>
	<LeverageView
		selection={pageSelection}
	/>
</Page>
