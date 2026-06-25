<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProgramInstallView from '$/views/BlockheadAgentProgramInstallView.svelte'
</script>


<Page>
	<BlockheadAgentProgramInstallView
		selection={select(EntityType.BlockheadAgentProgramInstall, data.selector)}
	/>
</Page>
