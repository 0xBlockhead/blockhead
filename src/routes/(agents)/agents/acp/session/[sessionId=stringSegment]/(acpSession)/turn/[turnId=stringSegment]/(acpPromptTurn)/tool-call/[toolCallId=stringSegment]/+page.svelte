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

	const pageSelection = $derived(select(EntityType.AcpToolCall, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpToolCallView from '$/views/AcpToolCallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.toolCallId || 'ACP tool call')} • ACP tool call • Blockhead</title>
</svelte:head>


<Page>
	<AcpToolCallView
		selection={pageSelection}
	/>
</Page>
