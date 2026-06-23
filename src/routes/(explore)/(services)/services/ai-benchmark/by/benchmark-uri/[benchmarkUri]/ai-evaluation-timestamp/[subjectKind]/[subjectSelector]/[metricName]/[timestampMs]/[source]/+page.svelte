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
	import AiEvaluation_TimestampView from '$/views/AiEvaluation_TimestampView.svelte'
</script>


<Page>
	<AiEvaluation_TimestampView
		selection={select(EntityType.AiEvaluation_Timestamp, data.selector)}
	/>
</Page>
