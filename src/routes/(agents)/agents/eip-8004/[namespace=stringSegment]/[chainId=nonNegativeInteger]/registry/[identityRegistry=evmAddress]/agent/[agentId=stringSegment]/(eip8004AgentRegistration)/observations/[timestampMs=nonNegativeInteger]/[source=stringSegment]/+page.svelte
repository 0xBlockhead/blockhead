<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Eip8004AgentRegistration_Timestamp, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'EIP-8004 agent registration timestamp')} • EIP-8004 agent registration timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EIP-8004 agent registration timestamp'} • EIP-8004 agent registration timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Eip8004AgentRegistration_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
