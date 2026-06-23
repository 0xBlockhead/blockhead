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
	import HederaToken_TimestampView from '$/views/HederaToken_TimestampView.svelte'
</script>


<Page>
	<HederaToken_TimestampView
		selection={select(EntityType.HederaToken_Timestamp, data.selector)}
	/>
</Page>
