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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpAgentRuntime, data.selector, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.runtimeId || 'ACP agent runtime')} • ACP agent runtime • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP agent runtime'} • ACP agent runtime • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpAgentRuntimeView
		selection={pageSelection}
	/>
	{/if}
</Page>
