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
	import XrplNetwork_TimestampView from '$/views/XrplNetwork_TimestampView.svelte'
</script>


<Page>
	<XrplNetwork_TimestampView
		selection={select(EntityType.XrplNetwork_Timestamp, data.selector)}
	/>
</Page>
