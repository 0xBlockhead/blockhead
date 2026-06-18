<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.XNetwork,
			{ scope: 'XNetwork' }
		).$$xUsers}
		id="x-users"
	/>
</Page>
