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
	import AvailNetwork_TimestampView from '$/views/AvailNetwork_TimestampView.svelte'
</script>


<Page>
	<AvailNetwork_TimestampView
		selection={select(EntityType.AvailNetwork_Timestamp, data.selector)}
	/>
</Page>
