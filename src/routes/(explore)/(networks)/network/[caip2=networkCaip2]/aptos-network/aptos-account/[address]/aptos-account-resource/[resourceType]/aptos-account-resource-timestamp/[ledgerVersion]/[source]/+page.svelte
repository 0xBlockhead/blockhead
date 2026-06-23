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
	import AptosAccountResource_TimestampView from '$/views/AptosAccountResource_TimestampView.svelte'
</script>


<Page>
	<AptosAccountResource_TimestampView
		selection={select(EntityType.AptosAccountResource_Timestamp, data.selector)}
	/>
</Page>
