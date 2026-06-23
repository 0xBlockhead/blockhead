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
	import AlgorandAsset_TimestampView from '$/views/AlgorandAsset_TimestampView.svelte'
</script>


<Page>
	<AlgorandAsset_TimestampView
		selection={select(EntityType.AlgorandAsset_Timestamp, data.selector)}
	/>
</Page>
