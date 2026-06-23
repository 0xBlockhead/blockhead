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
	import AiModel_TimestampView from '$/views/AiModel_TimestampView.svelte'
</script>


<Page>
	<AiModel_TimestampView
		selection={select(EntityType.AiModel_Timestamp, data.selector)}
	/>
</Page>
