<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmContractVerification, {
		$contract: data.selector,
	}, {
		fields: {
			match: true,
			runtimeMatch: true,
			creationMatch: true,
			verifiedAtMs: true,
			matchId: true,
			$compilation: true,
			$sourceBundle: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.match) ?? ''), String((pageSelection.entitySelector.runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).match) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM contract verification • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractVerificationView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>
