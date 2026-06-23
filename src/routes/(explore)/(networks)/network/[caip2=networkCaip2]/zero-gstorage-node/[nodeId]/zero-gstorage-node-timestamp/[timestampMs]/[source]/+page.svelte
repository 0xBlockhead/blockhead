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
	import ZeroGStorageNode_TimestampView from '$/views/ZeroGStorageNode_TimestampView.svelte'
</script>


<Page>
	<ZeroGStorageNode_TimestampView
		selection={select(EntityType.ZeroGStorageNode_Timestamp, data.selector)}
	/>
</Page>
