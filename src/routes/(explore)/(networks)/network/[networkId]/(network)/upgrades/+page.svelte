<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


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
		id="upgrades"
	/>
</Page>
