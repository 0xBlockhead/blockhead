<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


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
		href={resolve('/upgrades')}
		id="upgrades"
	/>
</Page>
