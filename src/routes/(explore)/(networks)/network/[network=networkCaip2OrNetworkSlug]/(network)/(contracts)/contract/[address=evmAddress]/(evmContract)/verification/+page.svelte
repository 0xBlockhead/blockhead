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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'EVM contract verification' : [String((({ ...{
		$contract: data.selector,
	}, ...pageSelection.entity }).match) ?? ''), String((({ ...{
		$contract: data.selector,
	}, ...pageSelection.entity }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification'))} • EVM contract verification • Blockhead</title>
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
