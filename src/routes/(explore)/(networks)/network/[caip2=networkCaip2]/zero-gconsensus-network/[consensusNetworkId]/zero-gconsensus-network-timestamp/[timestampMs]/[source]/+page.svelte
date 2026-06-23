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
	import ZeroGConsensusNetwork_TimestampView from '$/views/ZeroGConsensusNetwork_TimestampView.svelte'
</script>


<Page>
	<ZeroGConsensusNetwork_TimestampView
		selection={select(EntityType.ZeroGConsensusNetwork_Timestamp, data.selector)}
	/>
</Page>
