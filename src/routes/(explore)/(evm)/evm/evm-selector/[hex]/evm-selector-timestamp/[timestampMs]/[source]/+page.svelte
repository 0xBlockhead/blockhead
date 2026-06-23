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
	import EvmSelector_TimestampView from '$/views/EvmSelector_TimestampView.svelte'
</script>


<Page>
	<EvmSelector_TimestampView
		selection={select(EntityType.EvmSelector_Timestamp, data.selector)}
	/>
</Page>
