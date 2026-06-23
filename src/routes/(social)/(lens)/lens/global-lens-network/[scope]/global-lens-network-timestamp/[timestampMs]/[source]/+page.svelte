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
	import GlobalLensNetwork_TimestampView from '$/views/_GlobalLensNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalLensNetwork_TimestampView
		selection={select(EntityType._GlobalLensNetwork_Timestamp, data.selector)}
	/>
</Page>
