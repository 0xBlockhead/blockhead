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
	import ElementsPeg_TimestampView from '$/views/ElementsPeg_TimestampView.svelte'
</script>


<Page>
	<ElementsPeg_TimestampView
		selection={select(EntityType.ElementsPeg_Timestamp, data.selector)}
	/>
</Page>
