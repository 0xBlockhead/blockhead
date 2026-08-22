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

	const pageSelection = $derived(select(EntityType.Erc4337SmartAccount, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 smart account')} • ERC-4337 smart account • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337SmartAccountView
		selection={pageSelection}
	/>
</Page>
