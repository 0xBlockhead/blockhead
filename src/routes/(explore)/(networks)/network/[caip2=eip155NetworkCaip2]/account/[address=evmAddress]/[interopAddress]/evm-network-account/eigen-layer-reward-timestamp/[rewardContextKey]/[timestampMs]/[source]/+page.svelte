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
	import EigenLayerReward_TimestampView from '$/views/EigenLayerReward_TimestampView.svelte'
</script>


<Page>
	<EigenLayerReward_TimestampView
		selection={select(EntityType.EigenLayerReward_Timestamp, data.selector)}
	/>
</Page>
