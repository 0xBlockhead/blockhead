<!-- Generated from APP.ts. Do not edit by hand. -->

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
	<title>{(data.title ?? (pageSelection.entity == null ? 'EVM contract verification' : [(pageSelection.entity.match ?? ''), (pageSelection.entity.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification'))} • EVM contract verification • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractVerificationView
		selection={pageSelection}
	/>
</Page>
