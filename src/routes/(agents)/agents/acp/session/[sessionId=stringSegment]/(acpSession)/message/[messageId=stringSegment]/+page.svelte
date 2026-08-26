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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpMessage, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpMessageView from '$/views/AcpMessageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.messageId || 'ACP message')} • ACP message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP message'} • ACP message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
