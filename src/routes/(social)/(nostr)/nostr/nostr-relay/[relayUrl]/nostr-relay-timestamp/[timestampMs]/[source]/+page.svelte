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
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
</script>


<Page>
	<NostrRelay_TimestampView
		selection={select(EntityType.NostrRelay_Timestamp, data.selector)}
	/>
</Page>
