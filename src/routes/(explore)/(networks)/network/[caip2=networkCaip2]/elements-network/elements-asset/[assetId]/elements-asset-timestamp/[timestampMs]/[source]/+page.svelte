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
	import ElementsAsset_TimestampView from '$/views/ElementsAsset_TimestampView.svelte'
</script>


<Page>
	<ElementsAsset_TimestampView
		selection={select(EntityType.ElementsAsset_Timestamp, data.selector)}
	/>
</Page>
