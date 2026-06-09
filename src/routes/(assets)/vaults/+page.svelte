<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import VaultsView from '$/views/VaultsView.svelte'
</script>


<Page>
	<VaultsView
		href={resolve('/vaults')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$vaults' },
			fieldName: '$$vaults',
		}}
		id="vaults"
	/>
</Page>
