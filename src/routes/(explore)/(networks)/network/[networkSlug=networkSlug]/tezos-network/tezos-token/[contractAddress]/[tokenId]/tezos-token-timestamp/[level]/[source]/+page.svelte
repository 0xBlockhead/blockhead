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
	import TezosToken_TimestampView from '$/views/TezosToken_TimestampView.svelte'
</script>


<Page>
	<TezosToken_TimestampView
		selection={select(EntityType.TezosToken_Timestamp, data.selector)}
	/>
</Page>
