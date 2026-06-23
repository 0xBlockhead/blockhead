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
	import NetworkUpgrade_TimestampView from '$/views/NetworkUpgrade_TimestampView.svelte'
</script>


<Page>
	<NetworkUpgrade_TimestampView
		selection={select(EntityType.NetworkUpgrade_Timestamp, data.selector)}
	/>
</Page>
