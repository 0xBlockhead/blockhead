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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip8004AgentRegistrationFile, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.fileUrl || 'EIP-8004 agent registration file')} • EIP-8004 agent registration file • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004AgentRegistrationFileView
		selection={pageSelection}
	/>
</Page>
