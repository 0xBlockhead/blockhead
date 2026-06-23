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
	import CelestiaNetwork_TimestampView from '$/views/CelestiaNetwork_TimestampView.svelte'
</script>


<Page>
	<CelestiaNetwork_TimestampView
		selection={select(EntityType.CelestiaNetwork_Timestamp, data.selector)}
	/>
</Page>
