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
	import HederaNft_TimestampView from '$/views/HederaNft_TimestampView.svelte'
</script>


<Page>
	<HederaNft_TimestampView
		selection={select(EntityType.HederaNft_Timestamp, data.selector)}
	/>
</Page>
