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
	import BlockheadActionReadinessCheck_TimestampView from '$/views/BlockheadActionReadinessCheck_TimestampView.svelte'
</script>


<Page>
	<BlockheadActionReadinessCheck_TimestampView
		selection={select(EntityType.BlockheadActionReadinessCheck_Timestamp, data.selector)}
	/>
</Page>
