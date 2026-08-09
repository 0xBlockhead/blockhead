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

	const pageSelection = $derived(select(EntityType.Eip8004AgentRegistration_Timestamp, {
		$registration: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentRegistration_TimestampView from '$/views/Eip8004AgentRegistration_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'EIP-8004 agent registration timestamp')} • EIP-8004 agent registration timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004AgentRegistration_TimestampView
		selection={pageSelection}
	/>
</Page>
