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
	import EigenLayerAllocation_TimestampView from '$/views/EigenLayerAllocation_TimestampView.svelte'
</script>


<Page>
	<EigenLayerAllocation_TimestampView
		selection={select(EntityType.EigenLayerAllocation_Timestamp, data.selector)}
	/>
</Page>
