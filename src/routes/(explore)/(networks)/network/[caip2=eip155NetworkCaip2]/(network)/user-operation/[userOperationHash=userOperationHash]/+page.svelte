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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<svelte:head>
	<title>User operation • Blockhead</title>
</svelte:head>


<Page>
	<EvmUserOperationView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/user-operation/[userOperationHash=userOperationHash]', {
				caip2: params.caip2,
				userOperationHash: params.userOperationHash,
			})
		}
		selection={
			select(EntityType.EvmUserOperation, data.selector, {
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
			})
		}
	/>
</Page>
