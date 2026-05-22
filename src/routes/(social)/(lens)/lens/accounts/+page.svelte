<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<LensAccountsView
		entityFieldReference={{
			entityType: EntityType.LensNetwork,
			entityId: { scope: 'LensNetwork' },
			fieldName: '$$lensAccounts',
		}}
		href={resolve('/lens/accounts')}
		id="lens-accounts"
	/>
</Page>
