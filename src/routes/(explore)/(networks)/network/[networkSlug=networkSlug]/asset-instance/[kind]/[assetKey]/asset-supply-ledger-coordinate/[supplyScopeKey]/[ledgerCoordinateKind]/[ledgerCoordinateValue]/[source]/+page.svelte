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
	import AssetSupply_LedgerCoordinateView from '$/views/AssetSupply_LedgerCoordinateView.svelte'
</script>


<Page>
	<AssetSupply_LedgerCoordinateView
		selection={select(EntityType.AssetSupply_LedgerCoordinate, data.selector)}
	/>
</Page>
