<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import VaultsView from '$/views/VaultsView.svelte'
</script>


<Page>
	<VaultsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$vaults',
		}}
		href={resolve('/vaults')}
		id="vaults"
	/>
</Page>
