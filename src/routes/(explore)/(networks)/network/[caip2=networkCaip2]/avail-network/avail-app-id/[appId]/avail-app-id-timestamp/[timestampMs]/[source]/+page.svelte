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
	import AvailAppId_TimestampView from '$/views/AvailAppId_TimestampView.svelte'
</script>


<Page>
	<AvailAppId_TimestampView
		selection={select(EntityType.AvailAppId_Timestamp, data.selector)}
	/>
</Page>
