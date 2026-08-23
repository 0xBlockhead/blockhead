<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentProgramVersionView from '$/views/AcpAgentProgramVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpAgentProgramVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.AcpRegistry_Rest,
					],
					fields: {
						version: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'ACP agent program version' : (pageSelection.entity.version ?? '') || 'ACP agent program version')} • ACP agent program version • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP agent program version'} • ACP agent program version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpAgentProgramVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.AcpRegistry_Rest,
					],
					fields: {
						version: true,
					},
				}))}

		<AcpAgentProgramVersionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
