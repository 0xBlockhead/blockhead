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
	import AvalancheValidator_TimestampView from '$/views/AvalancheValidator_TimestampView.svelte'
</script>


<Page>
	<AvalancheValidator_TimestampView
		selection={select(EntityType.AvalancheValidator_Timestamp, data.selector)}
	/>
</Page>
