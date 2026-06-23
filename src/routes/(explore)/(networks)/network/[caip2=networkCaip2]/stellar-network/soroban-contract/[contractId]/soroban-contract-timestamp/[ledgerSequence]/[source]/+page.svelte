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
	import SorobanContract_TimestampView from '$/views/SorobanContract_TimestampView.svelte'
</script>


<Page>
	<SorobanContract_TimestampView
		selection={select(EntityType.SorobanContract_Timestamp, data.selector)}
	/>
</Page>
