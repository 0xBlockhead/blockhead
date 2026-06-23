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
	import GlobalXNetwork_TimestampView from '$/views/_GlobalXNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalXNetwork_TimestampView
		selection={select(EntityType._GlobalXNetwork_Timestamp, data.selector)}
	/>
</Page>
