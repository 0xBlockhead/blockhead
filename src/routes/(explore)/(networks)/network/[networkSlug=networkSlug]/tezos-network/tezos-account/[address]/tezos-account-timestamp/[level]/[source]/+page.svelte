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
	import TezosAccount_TimestampView from '$/views/TezosAccount_TimestampView.svelte'
</script>


<Page>
	<TezosAccount_TimestampView
		selection={select(EntityType.TezosAccount_Timestamp, data.selector)}
	/>
</Page>
