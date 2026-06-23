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
	import KaspaAddressUtxo_TimestampView from '$/views/KaspaAddressUtxo_TimestampView.svelte'
</script>


<Page>
	<KaspaAddressUtxo_TimestampView
		selection={select(EntityType.KaspaAddressUtxo_Timestamp, data.selector)}
	/>
</Page>
