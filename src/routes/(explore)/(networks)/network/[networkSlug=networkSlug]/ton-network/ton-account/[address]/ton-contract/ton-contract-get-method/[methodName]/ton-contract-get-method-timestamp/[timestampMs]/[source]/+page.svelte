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
	import TonContractGetMethod_TimestampView from '$/views/TonContractGetMethod_TimestampView.svelte'
</script>


<Page>
	<TonContractGetMethod_TimestampView
		selection={select(EntityType.TonContractGetMethod_Timestamp, data.selector)}
	/>
</Page>
