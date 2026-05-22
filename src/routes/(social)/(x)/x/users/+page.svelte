<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<XUsersView
		entityFieldReference={{
			entityType: EntityType.XNetwork,
			entityId: { scope: 'XNetwork' },
			fieldName: '$$xUsers',
		}}
		href={resolve('/x/users')}
		id="x-users"
	/>
</Page>
