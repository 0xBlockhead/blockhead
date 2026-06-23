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
	import TonNftItem_TimestampView from '$/views/TonNftItem_TimestampView.svelte'
</script>


<Page>
	<TonNftItem_TimestampView
		selection={select(EntityType.TonNftItem_Timestamp, data.selector)}
	/>
</Page>
