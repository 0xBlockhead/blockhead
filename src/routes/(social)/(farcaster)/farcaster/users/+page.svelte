<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
</script>


<Page>
	<FarcasterUsersView
		href={resolve('/farcaster/users')}
		id="users"
	/>
</Page>
