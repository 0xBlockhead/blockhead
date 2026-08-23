<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AcpToolCallView from '$/views/AcpToolCallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpToolCall, data.selector, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.toolCallId || 'ACP tool call')} • ACP tool call • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP tool call'} • ACP tool call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpToolCall, data.selector, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				}))}

		<AcpToolCallView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
