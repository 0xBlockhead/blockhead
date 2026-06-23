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
	import TronAccountTokenBalance_TimestampView from '$/views/TronAccountTokenBalance_TimestampView.svelte'
</script>


<Page>
	<TronAccountTokenBalance_TimestampView
		selection={select(EntityType.TronAccountTokenBalance_Timestamp, data.selector)}
	/>
</Page>
