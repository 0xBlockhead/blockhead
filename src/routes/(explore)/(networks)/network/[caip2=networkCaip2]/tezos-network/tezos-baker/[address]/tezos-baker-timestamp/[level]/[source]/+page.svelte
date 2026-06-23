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
	import TezosBaker_TimestampView from '$/views/TezosBaker_TimestampView.svelte'
</script>


<Page>
	<TezosBaker_TimestampView
		selection={select(EntityType.TezosBaker_Timestamp, data.selector)}
	/>
</Page>
