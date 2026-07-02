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
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 bundler • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337BundlerView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.Erc4337Bundler, data.selector, {
				fields: {
					$contract: true,
				},
			})
		}
	/>
</Page>
