<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004AgentRegistrationFile, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.fileUrl || 'EIP-8004 agent registration file')} • EIP-8004 agent registration file • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EIP-8004 agent registration file'} • EIP-8004 agent registration file • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004AgentRegistrationFile, data.selector))}

		<Eip8004AgentRegistrationFileView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
