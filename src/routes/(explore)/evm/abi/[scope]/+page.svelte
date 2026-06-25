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
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


<Page>
	<GlobalEvmAbiCatalogView
		selection={select(EntityType._GlobalEvmAbiCatalog, data.selector)}
	/>
</Page>
