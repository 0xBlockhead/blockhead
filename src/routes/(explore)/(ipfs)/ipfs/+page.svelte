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

	const pageSelection = $derived(select(EntityType.IpfsProtocol, data.selector, {
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
	<title>{data?.title ?? (pageSelection.entity == null ? 'IPFS protocol' : pageSelection.entity.protocolName || 'IPFS protocol')} • IPFS protocol • Blockhead</title>
</svelte:head>


<Page>
	<IpfsProtocolView
		selection={pageSelection}
	/>
</Page>
