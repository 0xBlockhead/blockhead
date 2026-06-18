<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'

	// Components
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EthereumNetworkUpgradesView
		selection={select(
			EntityType._Global,
			{ scope: '$$networkUpgrades' }
		).$$networkUpgrades({
			sources: [
				Source.Constants_Internal,
			],
			limit: 512,
		})}
		id="upgrades"
	/>
</Page>
