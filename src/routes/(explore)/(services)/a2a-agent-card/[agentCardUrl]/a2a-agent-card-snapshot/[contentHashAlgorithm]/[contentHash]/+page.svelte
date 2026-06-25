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
	import A2aAgentCard_SnapshotView from '$/views/A2aAgentCard_SnapshotView.svelte'
</script>


<Page>
	<A2aAgentCard_SnapshotView
		selection={select(EntityType.A2aAgentCard_Snapshot, data.selector)}
	/>
</Page>
