<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EvmAccountsView
		href={resolve('/~/accounts/watched-accounts')}
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$actors' },
			fieldName: '$$actors',
		}}
		id="accounts"
	/>
</Page>
