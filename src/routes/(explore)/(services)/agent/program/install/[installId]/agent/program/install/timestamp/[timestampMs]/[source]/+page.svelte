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
	import BlockheadAgentProgramInstall_TimestampView from '$/views/BlockheadAgentProgramInstall_TimestampView.svelte'
</script>


<Page>
	<BlockheadAgentProgramInstall_TimestampView
		selection={select(EntityType.BlockheadAgentProgramInstall_Timestamp, data.selector)}
	/>
</Page>
