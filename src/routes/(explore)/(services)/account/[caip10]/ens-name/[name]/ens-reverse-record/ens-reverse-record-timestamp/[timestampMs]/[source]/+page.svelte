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
	import EnsReverseRecord_TimestampView from '$/views/EnsReverseRecord_TimestampView.svelte'
</script>


<Page>
	<EnsReverseRecord_TimestampView
		selection={select(EntityType.EnsReverseRecord_Timestamp, data.selector)}
	/>
</Page>
