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

	const pageSelection = $derived(select(EntityType.AcpAgentRuntime, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentRuntimeView from '$/views/AcpAgentRuntimeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.runtimeId || 'ACP agent runtime')} • ACP agent runtime • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentRuntimeView
		selection={pageSelection}
	/>
</Page>
