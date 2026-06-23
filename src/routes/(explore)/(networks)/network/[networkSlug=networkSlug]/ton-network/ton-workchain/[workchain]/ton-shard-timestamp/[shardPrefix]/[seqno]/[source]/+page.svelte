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
	import TonShard_TimestampView from '$/views/TonShard_TimestampView.svelte'
</script>


<Page>
	<TonShard_TimestampView
		selection={select(EntityType.TonShard_Timestamp, data.selector)}
	/>
</Page>
