<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.QuilibriumFrame, data.selector, {
		sources: [
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumFrameView from '$/views/QuilibriumFrameView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.frameNumber) || 'quilibrium frame')} • quilibrium frame • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'quilibrium frame'} • quilibrium frame • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<QuilibriumFrameView
		selection={pageSelection}
	/>
	{/if}
</Page>
