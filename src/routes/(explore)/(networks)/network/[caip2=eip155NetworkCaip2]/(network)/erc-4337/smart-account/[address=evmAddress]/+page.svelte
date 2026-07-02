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
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 smart account • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337SmartAccountView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/smart-account/[address=evmAddress]', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.Erc4337SmartAccount, data.selector, {
				fields: {
					userOperationsCount: true,
					$contract: true,
					$factory: true,
				},
			})
		}
	/>
</Page>
