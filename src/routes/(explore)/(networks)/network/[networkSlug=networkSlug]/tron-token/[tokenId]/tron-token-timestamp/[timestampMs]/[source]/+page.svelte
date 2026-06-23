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
	import TronToken_TimestampView from '$/views/TronToken_TimestampView.svelte'
</script>


<Page>
	<TronToken_TimestampView
		selection={select(EntityType.TronToken_Timestamp, data.selector)}
	/>
</Page>
