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
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<Page>
	<StellarAssetView
		selection={select(EntityType.StellarAsset, data.selector)}
	/>
</Page>
