<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<Page>
	<CoinsView
		href={resolve('/coins')}
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$coins' },
			fieldName: '$$coins',
		}}
		id="coins"
		limit={120}
	/>
</Page>
