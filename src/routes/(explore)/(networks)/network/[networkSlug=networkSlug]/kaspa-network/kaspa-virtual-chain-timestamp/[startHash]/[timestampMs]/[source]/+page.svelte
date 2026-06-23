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
	import KaspaVirtualChain_TimestampView from '$/views/KaspaVirtualChain_TimestampView.svelte'
</script>


<Page>
	<KaspaVirtualChain_TimestampView
		selection={select(EntityType.KaspaVirtualChain_Timestamp, data.selector)}
	/>
</Page>
