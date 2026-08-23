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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Eip8004AgentRegistrationFile, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.fileUrl || 'EIP-8004 agent registration file')} • EIP-8004 agent registration file • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EIP-8004 agent registration file'} • EIP-8004 agent registration file • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Eip8004AgentRegistrationFileView
		selection={pageSelection}
	/>
	{/if}
</Page>
