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
	import MoneroNetwork_TimestampView from '$/views/MoneroNetwork_TimestampView.svelte'
</script>


<Page>
	<MoneroNetwork_TimestampView
		selection={select(EntityType.MoneroNetwork_Timestamp, data.selector)}
	/>
</Page>
