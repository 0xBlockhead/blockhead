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
	import A2aTask_TimestampView from '$/views/A2aTask_TimestampView.svelte'
</script>


<Page>
	<A2aTask_TimestampView
		selection={select(EntityType.A2aTask_Timestamp, data.selector)}
	/>
</Page>
