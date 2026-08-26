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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IpfsProtocol, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'IPFS protocol' : pageSelection.entity.protocolName || 'IPFS protocol')} • IPFS protocol • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IPFS protocol'} • IPFS protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IpfsProtocolView
		selection={pageSelection}
	/>
	{/if}
</Page>
