<!-- Generated from APP.ts. -->

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

	const pageSelection = $derived(select(EntityType.Erc4337Bundler, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 bundler')} • ERC-4337 bundler • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337BundlerView
		selection={pageSelection}
	/>
</Page>
