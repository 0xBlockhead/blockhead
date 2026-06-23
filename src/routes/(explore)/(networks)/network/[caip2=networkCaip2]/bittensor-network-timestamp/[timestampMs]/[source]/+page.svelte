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
	import BittensorNetwork_TimestampView from '$/views/BittensorNetwork_TimestampView.svelte'
</script>


<Page>
	<BittensorNetwork_TimestampView
		selection={select(EntityType.BittensorNetwork_Timestamp, data.selector)}
	/>
</Page>
