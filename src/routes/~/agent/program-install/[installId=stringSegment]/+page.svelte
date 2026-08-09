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

	const pageSelection = $derived(select(EntityType.BlockheadAgentProgramInstall, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProgramInstallView from '$/views/BlockheadAgentProgramInstallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.installId || 'blockhead agent program install')} • blockhead agent program install • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentProgramInstallView
		selection={pageSelection}
	/>
</Page>
