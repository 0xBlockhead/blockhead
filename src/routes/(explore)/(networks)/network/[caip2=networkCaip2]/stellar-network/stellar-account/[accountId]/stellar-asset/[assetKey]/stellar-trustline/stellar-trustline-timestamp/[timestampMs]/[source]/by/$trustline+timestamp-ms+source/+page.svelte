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
	import StellarTrustline_TimestampView from '$/views/StellarTrustline_TimestampView.svelte'
</script>


<Page>
	<StellarTrustline_TimestampView
		selection={select(EntityType.StellarTrustline_Timestamp, data.selector)}
	/>
</Page>
