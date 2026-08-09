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

	const pageSelection = $derived(select(EntityType.AcpAgentProgramVersion, {
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
	<title>{data.title ?? (pageSelection.entity == null ? 'ACP agent program version' : pageSelection.entity.version || 'ACP agent program version')} • ACP agent program version • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentProgramVersionView
		selection={pageSelection}
	/>
</Page>
