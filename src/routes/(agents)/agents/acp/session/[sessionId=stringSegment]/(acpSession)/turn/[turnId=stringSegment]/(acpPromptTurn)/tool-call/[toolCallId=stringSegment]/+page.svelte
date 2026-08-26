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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpToolCall, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpToolCallView from '$/views/AcpToolCallView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.toolCallId || 'ACP tool call')} • ACP tool call • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP tool call'} • ACP tool call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpToolCallView
		selection={pageSelection}
	/>
	{/if}
</Page>
