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


	// Components
	import Page from '$/components/Page.svelte'
	import MoveFunctionView from '$/views/MoveFunctionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MoveFunction, {
				$module: data.selector,
				functionName: params.functionName,
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.functionName || 'move function')} • move function • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'move function'} • move function • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MoveFunction, {
				$module: data.selector,
				functionName: params.functionName,
			})}

	<MoveFunctionView
		selection={pageSelection}
	/>
	{/if}
</Page>
