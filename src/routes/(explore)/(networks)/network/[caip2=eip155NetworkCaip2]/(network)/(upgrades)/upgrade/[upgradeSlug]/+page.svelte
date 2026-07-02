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
	import EthereumNetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<svelte:head>
	<title>Ethereum network upgrade • Blockhead</title>
</svelte:head>


<Page>
	<EthereumNetworkUpgradeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
				caip2: params.caip2,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={
			select(EntityType.EthereumNetworkUpgrade, data.selector, {
				fields: {
					name: true,
					activationBlock: true,
					activationEpoch: true,
					activationTimestampMs: true,
					$networkExecutionUpgrade: true,
					$networkConsensusUpgrade: true,
				},
			})
		}
	/>
</Page>
