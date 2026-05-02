<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<Page>
	<CoinsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$coins',
		}}
		href={resolve('/coins')}
		id="coins"
	/>
</Page>
