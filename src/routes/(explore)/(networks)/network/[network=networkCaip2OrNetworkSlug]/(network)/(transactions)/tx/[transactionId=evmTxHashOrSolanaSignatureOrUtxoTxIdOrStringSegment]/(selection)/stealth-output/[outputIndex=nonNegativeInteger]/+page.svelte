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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MoneroStealthOutput, {
		$transaction: data.selector,
		outputIndex: Number(params.outputIndex),
	}, {
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroStealthOutputView from '$/views/MoneroStealthOutputView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.outputIndex) || 'monero stealth output')} • monero stealth output • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'monero stealth output'} • monero stealth output • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MoneroStealthOutputView
		selection={pageSelection}
	/>
	{/if}
</Page>
