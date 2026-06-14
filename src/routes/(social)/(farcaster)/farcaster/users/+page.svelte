<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
</script>


<Page>
	<FarcasterUsersView
		href={resolve('/farcaster/users')}
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			selector: { scope: 'FarcasterNetwork' },
			fieldName: '$$users',
		}}
		id="users"
	/>
</Page>
