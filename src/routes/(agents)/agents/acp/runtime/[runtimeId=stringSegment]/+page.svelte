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
	import AcpAgentRuntimeView from '$/views/AcpAgentRuntimeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AcpAgentRuntime, data.selector, {
				sources: [
					Source.AcpLocal_JsonRpc,
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.runtimeId || 'ACP agent runtime')} • ACP agent runtime • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP agent runtime'} • ACP agent runtime • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AcpAgentRuntime, data.selector, {
				sources: [
					Source.AcpLocal_JsonRpc,
					Source.Local_Internal,
				],
			})}

	<AcpAgentRuntimeView
		selection={pageSelection}
	/>
	{/if}
</Page>
