<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<Page>
	<XUsersView
		href={resolve('/x/users')}
		entityFieldReference={{
			entityType: EntityType.XNetwork,
			selector: { scope: 'XNetwork' },
			fieldName: '$$xUsers',
		}}
		id="x-users"
	/>
</Page>
