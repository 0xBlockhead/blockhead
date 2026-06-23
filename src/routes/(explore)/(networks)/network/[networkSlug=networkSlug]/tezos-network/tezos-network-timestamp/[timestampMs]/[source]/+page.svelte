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
	import TezosNetwork_TimestampView from '$/views/TezosNetwork_TimestampView.svelte'
</script>


<Page>
	<TezosNetwork_TimestampView
		selection={select(EntityType.TezosNetwork_Timestamp, data.selector)}
	/>
</Page>
