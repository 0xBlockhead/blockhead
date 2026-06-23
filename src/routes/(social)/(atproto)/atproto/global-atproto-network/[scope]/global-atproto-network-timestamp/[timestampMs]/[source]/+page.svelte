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
	import GlobalAtprotoNetwork_TimestampView from '$/views/_GlobalAtprotoNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalAtprotoNetwork_TimestampView
		selection={select(EntityType._GlobalAtprotoNetwork_Timestamp, data.selector)}
	/>
</Page>
