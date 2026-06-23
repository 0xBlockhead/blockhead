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
	import TezosContract_TimestampView from '$/views/TezosContract_TimestampView.svelte'
</script>


<Page>
	<TezosContract_TimestampView
		selection={select(EntityType.TezosContract_Timestamp, data.selector)}
	/>
</Page>
