<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
</script>


<svelte:head>
	<title>Upgrades • Blockhead</title>
</svelte:head>


<Page>
	<EthereumNetworkUpgradesView
		href={resolve('/upgrades')}
		title='Upgrades'
		selection={
			select(EntityType._Global, {
				scope: '$$networkUpgrades',
			})[EntityProxyField]<EntityType.EthereumNetworkUpgrade>('$$networkUpgrades', {
				sources: [
					Source.Constants_Internal,
				],
				limit: 512,
			})
		}
		id='network-upgrades'
	/>
</Page>
