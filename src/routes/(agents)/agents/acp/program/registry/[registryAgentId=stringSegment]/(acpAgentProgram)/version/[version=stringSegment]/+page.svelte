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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AcpAgentProgramVersion, {
		$program: data.selector,
		version: params.version,
	}, {
		sources: [
			Source.AcpRegistry_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentProgramVersionView from '$/views/AcpAgentProgramVersionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.version || 'ACP agent program version')} • ACP agent program version • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentProgramVersionView
		selection={pageSelection}
	/>
</Page>
