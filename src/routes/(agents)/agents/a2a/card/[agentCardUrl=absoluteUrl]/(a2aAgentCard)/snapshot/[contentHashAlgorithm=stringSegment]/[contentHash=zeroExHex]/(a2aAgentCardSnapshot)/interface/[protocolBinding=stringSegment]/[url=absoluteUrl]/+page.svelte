<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aAgentInterface, {
		$cardSnapshot: data.selector,
		protocolBinding: params.protocolBinding,
		url: decodeURIComponent(params.url),
	}, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentInterfaceView from '$/views/A2aAgentInterfaceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.protocolBinding || 'A2A agent interface')} • A2A agent interface • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A agent interface'} • A2A agent interface • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aAgentInterfaceView
		selection={pageSelection}
	/>
	{/if}
</Page>
