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
	import AvalancheSubnet_TimestampView from '$/views/AvalancheSubnet_TimestampView.svelte'
</script>


<Page>
	<AvalancheSubnet_TimestampView
		selection={select(EntityType.AvalancheSubnet_Timestamp, data.selector)}
	/>
</Page>
