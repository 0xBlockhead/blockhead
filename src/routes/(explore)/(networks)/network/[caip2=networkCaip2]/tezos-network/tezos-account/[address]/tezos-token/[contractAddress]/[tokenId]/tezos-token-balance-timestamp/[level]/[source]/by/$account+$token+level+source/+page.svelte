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
	import TezosTokenBalance_TimestampView from '$/views/TezosTokenBalance_TimestampView.svelte'
</script>


<Page>
	<TezosTokenBalance_TimestampView
		selection={select(EntityType.TezosTokenBalance_Timestamp, data.selector)}
	/>
</Page>
