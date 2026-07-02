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
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<svelte:head>
	<title>Ethereum consensus upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumConsensusUpgradeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/consensus/[upgradeSlug]', {
				caip2: params.caip2,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={
			select(EntityType.EthereumConsensusUpgrade, data.selector, {
				fields: {
					name: true,
					protocol: true,
					activationBlock: true,
					activationEpoch: true,
					activationTimestampMs: true,
					previousForkVersion: true,
					currentForkVersion: true,
				},
			})
		}
	/>
</Page>
