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
	import CashuKeyset_TimestampView from '$/views/CashuKeyset_TimestampView.svelte'
</script>


<Page>
	<CashuKeyset_TimestampView
		selection={select(EntityType.CashuKeyset_Timestamp, data.selector)}
	/>
</Page>
