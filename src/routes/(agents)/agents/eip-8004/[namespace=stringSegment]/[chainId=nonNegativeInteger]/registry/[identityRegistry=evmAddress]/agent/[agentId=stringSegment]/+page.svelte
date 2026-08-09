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

	const pageSelection = $derived(select(EntityType.Eip8004AgentRegistration, data.selector, {
		sources: [
			Source.Eip8004Scan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.agentId || 'EIP-8004 agent registration')} • EIP-8004 agent registration • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004AgentRegistrationView
		selection={pageSelection}
	/>
</Page>
