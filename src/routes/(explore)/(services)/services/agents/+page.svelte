<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004ServicesView from '$/views/Eip8004ServicesView.svelte'
</script>


<Page>
	<Eip8004ServicesView
		href={resolve('/services')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$eip8004Services',
		}}
		id="agents"
	/>
</Page>
