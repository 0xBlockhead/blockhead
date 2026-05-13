<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import NetworkUpgradesView from '$/views/NetworkUpgradesView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<NetworkUpgradesView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$upgrades',
		}}
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/upgrades', params)}
		id="upgrades"
	/>
</Page>
