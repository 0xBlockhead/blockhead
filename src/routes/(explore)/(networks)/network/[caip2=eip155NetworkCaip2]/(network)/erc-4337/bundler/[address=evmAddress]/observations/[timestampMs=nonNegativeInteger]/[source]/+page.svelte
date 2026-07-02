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
	import Erc4337Bundler_TimestampView from '$/views/Erc4337Bundler_TimestampView.svelte'
</script>


<svelte:head>
	<title>ERC-4337 bundler timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337Bundler_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.Erc4337Bundler_Timestamp, data.selector, {
				fields: {
					userOperationsCount: true,
				},
			})
		}
	/>
</Page>
