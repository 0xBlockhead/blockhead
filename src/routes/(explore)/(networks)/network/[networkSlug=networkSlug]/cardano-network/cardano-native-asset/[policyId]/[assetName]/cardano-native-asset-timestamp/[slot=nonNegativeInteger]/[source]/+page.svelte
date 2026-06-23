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
	import CardanoNativeAsset_TimestampView from '$/views/CardanoNativeAsset_TimestampView.svelte'
</script>


<Page>
	<CardanoNativeAsset_TimestampView
		selection={select(EntityType.CardanoNativeAsset_Timestamp, data.selector)}
	/>
</Page>
