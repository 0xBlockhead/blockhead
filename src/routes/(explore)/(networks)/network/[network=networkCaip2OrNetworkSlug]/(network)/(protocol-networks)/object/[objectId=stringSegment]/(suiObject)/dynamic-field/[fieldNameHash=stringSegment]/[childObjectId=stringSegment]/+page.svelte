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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiDynamicFieldEdge, data.selector)}
		<title>{data?.title ?? 'Sui dynamic field edge'} • Sui dynamic field edge • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui dynamic field edge'} • Sui dynamic field edge • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiDynamicFieldEdge, data.selector)}

	<SuiDynamicFieldEdgeView
		selection={pageSelection}
	/>
	{/if}
</Page>
