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

	const pageSelection = $derived(select(EntityType.GitForgePipeline, data.selector, {
		fields: {
			pipelineIid: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgePipelineView from '$/views/GitForgePipelineView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Git forge pipeline' : 'Pipeline #' + String(pageSelection.entity.pipelineIid))} • Git forge pipeline • Blockhead</title>
</svelte:head>


<Page>
	<GitForgePipelineView
		selection={pageSelection}
	/>
</Page>
