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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MoveStruct, {
		$module: data.selector,
		structName: params.structName,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoveStructView from '$/views/MoveStructView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.structName || 'move struct')} • move struct • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'move struct'} • move struct • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MoveStructView
		selection={pageSelection}
	/>
	{/if}
</Page>
