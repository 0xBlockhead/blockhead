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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global EVM ABI catalog'} • global EVM ABI catalog • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEvmAbiCatalogView
		selection={
			select(EntityType._GlobalEvmAbiCatalog, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
