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
	import AptosNetwork_TimestampView from '$/views/AptosNetwork_TimestampView.svelte'
</script>


<Page>
	<AptosNetwork_TimestampView
		selection={select(EntityType.AptosNetwork_Timestamp, data.selector)}
	/>
</Page>
