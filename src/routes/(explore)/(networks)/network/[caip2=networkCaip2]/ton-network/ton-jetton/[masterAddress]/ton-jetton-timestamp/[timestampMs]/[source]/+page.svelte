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
	import TonJetton_TimestampView from '$/views/TonJetton_TimestampView.svelte'
</script>


<Page>
	<TonJetton_TimestampView
		selection={select(EntityType.TonJetton_Timestamp, data.selector)}
	/>
</Page>
