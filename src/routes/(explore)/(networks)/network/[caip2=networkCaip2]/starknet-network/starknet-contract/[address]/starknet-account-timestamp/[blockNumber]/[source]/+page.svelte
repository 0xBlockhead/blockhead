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
	import StarknetAccount_TimestampView from '$/views/StarknetAccount_TimestampView.svelte'
</script>


<Page>
	<StarknetAccount_TimestampView
		selection={select(EntityType.StarknetAccount_Timestamp, data.selector)}
	/>
</Page>
