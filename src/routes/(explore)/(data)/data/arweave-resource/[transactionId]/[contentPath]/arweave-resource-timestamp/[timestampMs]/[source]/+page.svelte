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
	import ArweaveResource_TimestampView from '$/views/ArweaveResource_TimestampView.svelte'
</script>


<Page>
	<ArweaveResource_TimestampView
		selection={select(EntityType.ArweaveResource_Timestamp, data.selector)}
	/>
</Page>
