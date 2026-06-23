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
	import PolkadotAssetBalance_TimestampView from '$/views/PolkadotAssetBalance_TimestampView.svelte'
</script>


<Page>
	<PolkadotAssetBalance_TimestampView
		selection={select(EntityType.PolkadotAssetBalance_Timestamp, data.selector)}
	/>
</Page>
