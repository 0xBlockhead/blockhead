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
	import ArweaveNetwork_TimestampView from '$/views/ArweaveNetwork_TimestampView.svelte'
</script>


<Page>
	<ArweaveNetwork_TimestampView
		selection={select(EntityType.ArweaveNetwork_Timestamp, data.selector)}
	/>
</Page>
