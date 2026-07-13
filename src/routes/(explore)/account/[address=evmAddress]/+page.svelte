<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
			avatarUrl: true,
			$primaryName: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.address) ?? '')].filter(Boolean).join(' ') || 'EVM account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'EVM account'))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM account • Blockhead</title>
</svelte:head>


<Page>
	<EvmAccountView
		href={
			resolve('/account/[address=evmAddress]', {
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
