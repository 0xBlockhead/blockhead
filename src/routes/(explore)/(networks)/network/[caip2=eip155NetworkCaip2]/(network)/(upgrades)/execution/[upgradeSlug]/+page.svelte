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
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
</script>


<svelte:head>
	<title>Ethereum execution upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumExecutionUpgradeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/execution/[upgradeSlug]', {
				caip2: params.caip2,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={
			select(EntityType.EthereumExecutionUpgrade, data.selector, {
				fields: {
					name: true,
					protocol: true,
					activationBlock: true,
					activationEpoch: true,
					activationTimestampMs: true,
				},
			})
		}
	/>
</Page>
