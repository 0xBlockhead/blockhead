<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

	// Components
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EthereumNetworkUpgradesView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$networkUpgrades' },
			fieldName: '$$networkUpgrades',
		}}
		id="upgrades"
	/>
</Page>
