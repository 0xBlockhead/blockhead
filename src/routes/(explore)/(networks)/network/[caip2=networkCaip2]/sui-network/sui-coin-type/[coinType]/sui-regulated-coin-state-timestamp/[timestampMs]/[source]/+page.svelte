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
	import SuiRegulatedCoinState_TimestampView from '$/views/SuiRegulatedCoinState_TimestampView.svelte'
</script>


<Page>
	<SuiRegulatedCoinState_TimestampView
		selection={select(EntityType.SuiRegulatedCoinState_Timestamp, data.selector)}
	/>
</Page>
