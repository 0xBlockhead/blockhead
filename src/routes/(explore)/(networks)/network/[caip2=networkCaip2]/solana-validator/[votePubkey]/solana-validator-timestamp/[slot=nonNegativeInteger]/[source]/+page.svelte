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
	import SolanaValidator_TimestampView from '$/views/SolanaValidator_TimestampView.svelte'
</script>


<Page>
	<SolanaValidator_TimestampView
		selection={select(EntityType.SolanaValidator_Timestamp, data.selector)}
	/>
</Page>
