<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmAccount, {
		address: params.address,
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			interopAddress: true,
			avatarUrl: true,
			$primaryName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<svelte:head>
	<title>{(String(pageSelection.entitySelector.address) || 'EVM account')} • EVM account • Blockhead</title>
</svelte:head>


<Page>
	<EvmAccountView
		selection={pageSelection}
	/>
</Page>
