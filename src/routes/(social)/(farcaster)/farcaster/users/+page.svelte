<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<FarcasterUsersView
		entityFieldReference={{
			entityType: EntityType.FarcasterNetwork,
			entityId: { scope: 'FarcasterNetwork' },
			fieldName: '$$users',
		}}
		href={resolve('/farcaster/users')}
		id="users"
	/>
</Page>
