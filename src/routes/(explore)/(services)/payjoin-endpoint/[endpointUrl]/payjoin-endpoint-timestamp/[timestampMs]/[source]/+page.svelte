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
	import PayjoinEndpoint_TimestampView from '$/views/PayjoinEndpoint_TimestampView.svelte'
</script>


<Page>
	<PayjoinEndpoint_TimestampView
		selection={select(EntityType.PayjoinEndpoint_Timestamp, data.selector)}
	/>
</Page>
