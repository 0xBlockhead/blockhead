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
	import PolkadotReferendum_TimestampView from '$/views/PolkadotReferendum_TimestampView.svelte'
</script>


<Page>
	<PolkadotReferendum_TimestampView
		selection={select(EntityType.PolkadotReferendum_Timestamp, data.selector)}
	/>
</Page>
