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
	import AcpAgentProgramView from '$/views/AcpAgentProgramView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpAgentProgram, data.selector, {
					sources: [
						Source.AcpRegistry_Rest,
					],
					fields: {
						label: true,
						packageName: true,
						repositoryUrl: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.registryAgentId ?? '') || 'ACP agent program' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.registryAgentId ?? ''), (pageSelection.entity.packageName ?? ''), (pageSelection.entity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program')} • ACP agent program • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ACP agent program'} • ACP agent program • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AcpAgentProgram, data.selector, {
					sources: [
						Source.AcpRegistry_Rest,
					],
					fields: {
						label: true,
						packageName: true,
						repositoryUrl: true,
					},
				}))}

		<AcpAgentProgramView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
