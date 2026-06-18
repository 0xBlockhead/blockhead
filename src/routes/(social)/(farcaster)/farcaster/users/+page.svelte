<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.FarcasterNetwork,
			{ scope: 'FarcasterNetwork' }
		).$$users}
		id="users"
	/>
</Page>
