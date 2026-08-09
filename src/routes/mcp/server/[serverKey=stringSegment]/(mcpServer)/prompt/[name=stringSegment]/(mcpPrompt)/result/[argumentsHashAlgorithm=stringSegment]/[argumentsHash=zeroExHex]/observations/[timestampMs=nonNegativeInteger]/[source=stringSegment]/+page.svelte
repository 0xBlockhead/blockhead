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

	const pageSelection = $derived(select(EntityType.McpPromptResult, {
		$prompt: data.selector,
		argumentsHashAlgorithm: params.argumentsHashAlgorithm,
		argumentsHash: params.argumentsHash,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpPromptResultView from '$/views/McpPromptResultView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'mcp prompt result')} • mcp prompt result • Blockhead</title>
</svelte:head>


<Page>
	<McpPromptResultView
		selection={pageSelection}
	/>
</Page>
