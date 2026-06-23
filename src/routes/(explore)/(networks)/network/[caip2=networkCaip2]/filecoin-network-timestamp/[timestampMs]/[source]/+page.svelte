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
	import FilecoinNetwork_TimestampView from '$/views/FilecoinNetwork_TimestampView.svelte'
</script>


<Page>
	<FilecoinNetwork_TimestampView
		selection={select(EntityType.FilecoinNetwork_Timestamp, data.selector)}
	/>
</Page>
