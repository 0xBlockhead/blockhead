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
	import BlockheadActionOutcome_TimestampView from '$/views/BlockheadActionOutcome_TimestampView.svelte'
</script>


<Page>
	<BlockheadActionOutcome_TimestampView
		selection={select(EntityType.BlockheadActionOutcome_Timestamp, data.selector)}
	/>
</Page>
