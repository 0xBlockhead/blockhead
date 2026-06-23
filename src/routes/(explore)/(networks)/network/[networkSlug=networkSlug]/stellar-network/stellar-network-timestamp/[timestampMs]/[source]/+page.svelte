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
	import StellarNetwork_TimestampView from '$/views/StellarNetwork_TimestampView.svelte'
</script>


<Page>
	<StellarNetwork_TimestampView
		selection={select(EntityType.StellarNetwork_Timestamp, data.selector)}
	/>
</Page>
