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
	import MoveStructView from '$/views/MoveStructView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MoveStruct, {
				$module: data.selector,
				structName: params.structName,
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.structName || 'move struct')} • move struct • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'move struct'} • move struct • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MoveStruct, {
				$module: data.selector,
				structName: params.structName,
			})}

	<MoveStructView
		selection={pageSelection}
	/>
	{/if}
</Page>
