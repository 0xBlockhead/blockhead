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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpTerminal, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpTerminalView from '$/views/AcpTerminalView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.terminalId || 'ACP terminal')} • ACP terminal • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP terminal'} • ACP terminal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpTerminalView
		selection={pageSelection}
	/>
	{/if}
</Page>
