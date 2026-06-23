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
	import LightningNode_TimestampView from '$/views/LightningNode_TimestampView.svelte'
</script>


<Page>
	<LightningNode_TimestampView
		selection={select(EntityType.LightningNode_Timestamp, data.selector)}
	/>
</Page>
