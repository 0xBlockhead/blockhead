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
	import RegulatedAssetProfile_TimestampView from '$/views/RegulatedAssetProfile_TimestampView.svelte'
</script>


<Page>
	<RegulatedAssetProfile_TimestampView
		selection={select(EntityType.RegulatedAssetProfile_Timestamp, data.selector)}
	/>
</Page>
