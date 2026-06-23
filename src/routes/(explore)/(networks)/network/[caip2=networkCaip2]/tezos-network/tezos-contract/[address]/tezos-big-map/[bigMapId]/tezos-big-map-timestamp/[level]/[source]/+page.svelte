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
	import TezosBigMap_TimestampView from '$/views/TezosBigMap_TimestampView.svelte'
</script>


<Page>
	<TezosBigMap_TimestampView
		selection={select(EntityType.TezosBigMap_Timestamp, data.selector)}
	/>
</Page>
