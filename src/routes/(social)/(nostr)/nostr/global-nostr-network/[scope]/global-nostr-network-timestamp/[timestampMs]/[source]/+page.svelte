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
	import GlobalNostrNetwork_TimestampView from '$/views/_GlobalNostrNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalNostrNetwork_TimestampView
		selection={select(EntityType._GlobalNostrNetwork_Timestamp, data.selector)}
	/>
</Page>
