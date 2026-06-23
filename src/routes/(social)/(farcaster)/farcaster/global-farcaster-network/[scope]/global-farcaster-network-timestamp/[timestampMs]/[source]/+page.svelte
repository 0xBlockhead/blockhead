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
	import GlobalFarcasterNetwork_TimestampView from '$/views/_GlobalFarcasterNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalFarcasterNetwork_TimestampView
		selection={select(EntityType._GlobalFarcasterNetwork_Timestamp, data.selector)}
	/>
</Page>
