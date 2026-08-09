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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentProgramInstall_Timestamp, {
		$install: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProgramInstall_TimestampView from '$/views/BlockheadAgentProgramInstall_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead agent program install timestamp')} • blockhead agent program install timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentProgramInstall_TimestampView
		selection={pageSelection}
	/>
</Page>
