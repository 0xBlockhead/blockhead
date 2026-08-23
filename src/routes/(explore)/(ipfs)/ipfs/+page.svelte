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
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IpfsProtocol, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'IPFS protocol' : pageSelection.entity.protocolName || 'IPFS protocol')} • IPFS protocol • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IPFS protocol'} • IPFS protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IpfsProtocol, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}

	<IpfsProtocolView
		selection={pageSelection}
	/>
	{/if}
</Page>
