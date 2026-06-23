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
	import GlobalArweaveNetwork_TimestampView from '$/views/_GlobalArweaveNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalArweaveNetwork_TimestampView
		selection={select(EntityType._GlobalArweaveNetwork_Timestamp, data.selector)}
	/>
</Page>
