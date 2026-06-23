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
	import CelestiaNamespace_TimestampView from '$/views/CelestiaNamespace_TimestampView.svelte'
</script>


<Page>
	<CelestiaNamespace_TimestampView
		selection={select(EntityType.CelestiaNamespace_Timestamp, data.selector)}
	/>
</Page>
