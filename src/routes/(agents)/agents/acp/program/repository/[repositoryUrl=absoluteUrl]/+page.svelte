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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AcpAgentProgram, {
		repositoryUrl: decodeURIComponent(params.repositoryUrl),
	}, {
		sources: [
			Source.AcpRegistry_Rest,
		],
		fields: {
			label: true,
			registryAgentId: true,
			packageName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentProgramView from '$/views/AcpAgentProgramView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.repositoryUrl ?? '') || 'ACP agent program' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.registryAgentId ?? ''), (pageSelection.entity.packageName ?? ''), (pageSelection.entitySelector.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program'} • ACP agent program • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentProgramView
		selection={pageSelection}
	/>
</Page>
