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
	import HederaNetwork_TimestampView from '$/views/HederaNetwork_TimestampView.svelte'
</script>


<Page>
	<HederaNetwork_TimestampView
		selection={select(EntityType.HederaNetwork_Timestamp, data.selector)}
	/>
</Page>
