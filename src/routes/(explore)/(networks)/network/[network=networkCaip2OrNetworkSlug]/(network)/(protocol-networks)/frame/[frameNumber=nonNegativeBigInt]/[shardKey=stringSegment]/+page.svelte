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

	const pageSelection = $derived(select(EntityType.QuilibriumFrame, data.selector, {
		sources: [
			Source.QuilibriumNode_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import QuilibriumFrameView from '$/views/QuilibriumFrameView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.frameNumber) || 'quilibrium frame')} • quilibrium frame • Blockhead</title>
</svelte:head>


<Page>
	<QuilibriumFrameView
		selection={pageSelection}
	/>
</Page>
