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
	import KaspaNetwork_TimestampView from '$/views/KaspaNetwork_TimestampView.svelte'
</script>


<Page>
	<KaspaNetwork_TimestampView
		selection={select(EntityType.KaspaNetwork_Timestamp, data.selector)}
	/>
</Page>
