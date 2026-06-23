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
	import HederaNode_TimestampView from '$/views/HederaNode_TimestampView.svelte'
</script>


<Page>
	<HederaNode_TimestampView
		selection={select(EntityType.HederaNode_Timestamp, data.selector)}
	/>
</Page>
