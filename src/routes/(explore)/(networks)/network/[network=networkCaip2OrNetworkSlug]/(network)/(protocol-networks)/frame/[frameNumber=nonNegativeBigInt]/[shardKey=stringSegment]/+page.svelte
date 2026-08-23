<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumFrameView from '$/views/QuilibriumFrameView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumFrame, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.frameNumber) || 'quilibrium frame')} • quilibrium frame • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'quilibrium frame'} • quilibrium frame • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumFrame, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}

	<QuilibriumFrameView
		selection={pageSelection}
	/>
	{/if}
</Page>
