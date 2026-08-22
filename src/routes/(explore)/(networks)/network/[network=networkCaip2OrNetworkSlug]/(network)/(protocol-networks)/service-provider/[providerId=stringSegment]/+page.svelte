<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ZeroGServiceProvider, data.selector, {
		sources: [
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGServiceProviderView from '$/views/ZeroGServiceProviderView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.providerId || 'zero g service provider')} • zero g service provider • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGServiceProviderView
		selection={pageSelection}
	/>
</Page>
