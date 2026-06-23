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
	import GlobalRedditNetwork_TimestampView from '$/views/_GlobalRedditNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalRedditNetwork_TimestampView
		selection={select(EntityType._GlobalRedditNetwork_Timestamp, data.selector)}
	/>
</Page>
