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
	import FilecoinDeal_TimestampView from '$/views/FilecoinDeal_TimestampView.svelte'
</script>


<Page>
	<FilecoinDeal_TimestampView
		selection={select(EntityType.FilecoinDeal_Timestamp, data.selector)}
	/>
</Page>
