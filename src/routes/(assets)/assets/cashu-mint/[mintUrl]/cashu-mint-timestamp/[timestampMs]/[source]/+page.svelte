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
	import CashuMint_TimestampView from '$/views/CashuMint_TimestampView.svelte'
</script>


<Page>
	<CashuMint_TimestampView
		selection={select(EntityType.CashuMint_Timestamp, data.selector)}
	/>
</Page>
