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
	import FedimintGateway_TimestampView from '$/views/FedimintGateway_TimestampView.svelte'
</script>


<Page>
	<FedimintGateway_TimestampView
		selection={select(EntityType.FedimintGateway_Timestamp, data.selector)}
	/>
</Page>
