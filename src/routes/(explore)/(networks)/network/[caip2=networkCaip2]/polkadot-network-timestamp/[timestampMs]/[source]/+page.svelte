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
	import PolkadotNetwork_TimestampView from '$/views/PolkadotNetwork_TimestampView.svelte'
</script>


<Page>
	<PolkadotNetwork_TimestampView
		selection={select(EntityType.PolkadotNetwork_Timestamp, data.selector)}
	/>
</Page>
