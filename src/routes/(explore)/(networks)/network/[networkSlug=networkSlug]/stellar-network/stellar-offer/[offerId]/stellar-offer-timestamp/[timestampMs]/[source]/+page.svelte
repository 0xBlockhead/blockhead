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
	import StellarOffer_TimestampView from '$/views/StellarOffer_TimestampView.svelte'
</script>


<Page>
	<StellarOffer_TimestampView
		selection={select(EntityType.StellarOffer_Timestamp, data.selector)}
	/>
</Page>
