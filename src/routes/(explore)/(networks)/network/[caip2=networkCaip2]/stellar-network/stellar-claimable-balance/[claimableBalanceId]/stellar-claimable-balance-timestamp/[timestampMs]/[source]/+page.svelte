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
	import StellarClaimableBalance_TimestampView from '$/views/StellarClaimableBalance_TimestampView.svelte'
</script>


<Page>
	<StellarClaimableBalance_TimestampView
		selection={select(EntityType.StellarClaimableBalance_Timestamp, data.selector)}
	/>
</Page>
