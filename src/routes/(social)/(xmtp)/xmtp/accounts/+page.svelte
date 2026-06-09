<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
</script>


<Page>
	<EvmAccountsView
		href={resolve('/~/accounts')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$actors' },
			fieldName: '$$actors',
		}}
		id="accounts"
	/>
</Page>
