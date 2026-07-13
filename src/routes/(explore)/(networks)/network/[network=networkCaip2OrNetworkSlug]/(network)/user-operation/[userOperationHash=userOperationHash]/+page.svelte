<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmUserOperation, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			successful: true,
			timestampMs: true,
			fee: true,
			nonce: true,
			entryPointVersion: true,
			sponsorType: true,
			$bundledTransaction: true,
			$block: true,
			$sender: true,
			$paymaster: true,
			$bundler: true,
			$entryPoint: true,
			callGasLimit: true,
			verificationGasLimit: true,
			preVerificationGas: true,
			maxFeePerGas: true,
			maxPriorityFeePerGas: true,
			gas: true,
			gasUsed: true,
			gasPrice: true,
			initCode: true,
			callData: true,
			paymasterAndData: true,
			signature: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'User operation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'User operation')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • User operation • Blockhead</title>
</svelte:head>


<Page>
	<EvmUserOperationView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
				network: params.network,
				userOperationHash: params.userOperationHash,
			})
		}
		selection={pageSelection}
	/>
</Page>
