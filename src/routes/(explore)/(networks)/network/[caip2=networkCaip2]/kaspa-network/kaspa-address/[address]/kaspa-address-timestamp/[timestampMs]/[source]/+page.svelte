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
	import KaspaAddress_TimestampView from '$/views/KaspaAddress_TimestampView.svelte'
</script>


<Page>
	<KaspaAddress_TimestampView
		selection={select(EntityType.KaspaAddress_Timestamp, data.selector)}
	/>
</Page>
