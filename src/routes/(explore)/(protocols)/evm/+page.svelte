<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.EvmProtocol, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			registryName: true,
			relationshipModel: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'EVM protocol' : pageSelection.entity.protocolName || 'EVM protocol')} • EVM protocol • Blockhead</title>
</svelte:head>


<Page>
	<EvmProtocolView
		selection={pageSelection}
	/>
</Page>
