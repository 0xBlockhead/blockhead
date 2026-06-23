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
	import TezosBaker_Cycle_TimestampView from '$/views/TezosBaker_Cycle_TimestampView.svelte'
</script>


<Page>
	<TezosBaker_Cycle_TimestampView
		selection={select(EntityType.TezosBaker_Cycle_Timestamp, data.selector)}
	/>
</Page>
