<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MoveFunction, {
		$module: data.selector,
		functionName: params.functionName,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoveFunctionView from '$/views/MoveFunctionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.functionName || 'move function')} • move function • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'move function'} • move function • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MoveFunctionView
		selection={pageSelection}
	/>
	{/if}
</Page>
