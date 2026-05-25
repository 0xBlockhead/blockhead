<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import NetworkUpgradesView from '$/views/NetworkUpgradesView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<NetworkUpgradesView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$networkUpgrades',
		}}
		id="upgrades"
	/>
</Page>
