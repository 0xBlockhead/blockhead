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

	const pageSelection = $derived(select(EntityType.AcpAgentProgram, data.selector, {
		sources: [
			Source.AcpRegistry_Rest,
		],
		fields: {
			label: true,
			packageName: true,
			repositoryUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentProgramView from '$/views/AcpAgentProgramView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.registryAgentId ?? '') || 'ACP agent program' : (pageSelection.entity.label ?? '') || [pageSelection.entitySelector.registryAgentId, pageSelection.entity.packageName, pageSelection.entity.repositoryUrl].filter(Boolean).join(' ') || 'ACP agent program')} • ACP agent program • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentProgramView
		selection={pageSelection}
	/>
</Page>
