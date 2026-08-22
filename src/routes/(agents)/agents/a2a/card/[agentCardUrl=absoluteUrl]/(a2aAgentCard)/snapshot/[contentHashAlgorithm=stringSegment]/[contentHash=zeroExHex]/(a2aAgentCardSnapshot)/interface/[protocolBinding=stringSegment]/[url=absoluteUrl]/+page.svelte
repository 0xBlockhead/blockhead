<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.A2aAgentInterface, {
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
	<title>{data?.title ?? (pageSelection.entitySelector.protocolBinding || 'A2A agent interface')} • A2A agent interface • Blockhead</title>
</svelte:head>


<Page>
	<A2aAgentInterfaceView
		selection={pageSelection}
	/>
</Page>
