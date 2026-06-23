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
	import TonJettonBalance_TimestampView from '$/views/TonJettonBalance_TimestampView.svelte'
</script>


<Page>
	<TonJettonBalance_TimestampView
		selection={select(EntityType.TonJettonBalance_Timestamp, data.selector)}
	/>
</Page>
