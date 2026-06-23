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
	import XrplTrustline_TimestampView from '$/views/XrplTrustline_TimestampView.svelte'
</script>


<Page>
	<XrplTrustline_TimestampView
		selection={select(EntityType.XrplTrustline_Timestamp, data.selector)}
	/>
</Page>
