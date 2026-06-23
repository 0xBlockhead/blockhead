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
	import HederaTopic_TimestampView from '$/views/HederaTopic_TimestampView.svelte'
</script>


<Page>
	<HederaTopic_TimestampView
		selection={select(EntityType.HederaTopic_Timestamp, data.selector)}
	/>
</Page>
