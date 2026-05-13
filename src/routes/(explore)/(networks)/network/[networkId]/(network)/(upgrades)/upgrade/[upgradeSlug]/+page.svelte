<script lang="ts">
	// Types/constants
	import { networkUpgradeIdFromChainIdAndUrlSegment } from '$/constants/EthereumUpgrades.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<Page>
	<NetworkUpgradeView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			upgradeId: (
				networkUpgradeIdFromChainIdAndUrlSegment(
					Number(params.networkId),
					params.upgradeSlug,
				) ?? params.upgradeSlug
			),
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
			params,
		)}
	/>
</Page>
