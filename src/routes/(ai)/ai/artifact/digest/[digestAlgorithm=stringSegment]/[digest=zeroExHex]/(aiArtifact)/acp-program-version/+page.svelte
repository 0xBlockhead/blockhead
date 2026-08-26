<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpAgentProgramVersion, {
		$artifact: data.selector,
	}, {
		sources: [
			Source.AcpRegistry_Rest,
		],
		fields: {
			version: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentProgramVersionView from '$/views/AcpAgentProgramVersionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'ACP agent program version' : (pageSelection.entity.version ?? '') || 'ACP agent program version')} • ACP agent program version • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP agent program version'} • ACP agent program version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpAgentProgramVersionView
		selection={pageSelection}
	/>
	{/if}
</Page>
