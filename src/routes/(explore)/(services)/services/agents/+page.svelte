<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004RegistrationsView from '$/views/Eip8004RegistrationsView.svelte'
</script>


<Page>
	<Eip8004RegistrationsView
		href={resolve('/services')}
		selection={select(
			EntityType._Global,
			{ scope: '$$eip8004Services' }
		).$$eip8004Services}
		id="agents"
	/>
</Page>
