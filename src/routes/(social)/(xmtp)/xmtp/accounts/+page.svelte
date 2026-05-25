<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
</script>


<Page>
	<ActorsView
		href={resolve('/~/accounts')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$actors',
		}}
		id="accounts"
	/>
</Page>
