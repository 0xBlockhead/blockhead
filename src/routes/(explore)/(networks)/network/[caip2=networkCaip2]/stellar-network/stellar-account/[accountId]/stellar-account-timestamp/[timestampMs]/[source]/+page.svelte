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
	import StellarAccount_TimestampView from '$/views/StellarAccount_TimestampView.svelte'
</script>


<Page>
	<StellarAccount_TimestampView
		selection={select(EntityType.StellarAccount_Timestamp, data.selector)}
	/>
</Page>
