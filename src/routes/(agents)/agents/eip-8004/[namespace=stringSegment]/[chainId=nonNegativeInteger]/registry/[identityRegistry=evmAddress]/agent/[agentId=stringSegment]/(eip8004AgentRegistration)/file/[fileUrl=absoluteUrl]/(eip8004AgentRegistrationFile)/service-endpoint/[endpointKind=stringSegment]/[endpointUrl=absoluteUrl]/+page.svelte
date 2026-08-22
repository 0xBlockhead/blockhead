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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip8004AgentServiceEndpoint, {
		$registrationFile: data.selector,
		endpointKind: params.endpointKind,
		endpointUrl: decodeURIComponent(params.endpointUrl),
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'EIP-8004 agent service endpoint')} • EIP-8004 agent service endpoint • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004AgentServiceEndpointView
		selection={pageSelection}
	/>
</Page>
