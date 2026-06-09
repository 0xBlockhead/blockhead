<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
</script>


<Page>
	<LensAccountsView
		href={resolve('/lens/accounts')}
		entityFieldReference={{
			entityType: EntityType.LensNetwork,
			entityId: { scope: 'LensNetwork' },
			fieldName: '$$lensAccounts',
		}}
		id="lens-accounts"
	/>
</Page>
