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

	const pageSelection = $derived(select(EntityType.MoveFunction, {
		$module: data.selector,
		functionName: params.functionName,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoveFunctionView from '$/views/MoveFunctionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.functionName || 'move function')} • move function • Blockhead</title>
</svelte:head>


<Page>
	<MoveFunctionView
		selection={pageSelection}
	/>
</Page>
