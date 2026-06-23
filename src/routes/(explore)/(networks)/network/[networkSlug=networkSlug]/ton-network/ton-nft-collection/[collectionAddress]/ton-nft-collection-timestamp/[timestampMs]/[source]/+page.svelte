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
	import TonNftCollection_TimestampView from '$/views/TonNftCollection_TimestampView.svelte'
</script>


<Page>
	<TonNftCollection_TimestampView
		selection={select(EntityType.TonNftCollection_Timestamp, data.selector)}
	/>
</Page>
