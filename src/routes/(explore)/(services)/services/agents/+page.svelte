<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004RegistrationsView from '$/views/Eip8004RegistrationsView.svelte'
</script>


<Page>
	<Eip8004RegistrationsView
		href={resolve('/services')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$eip8004Services' },
			fieldName: '$$eip8004Services',
		}}
		id="agents"
	/>
</Page>
