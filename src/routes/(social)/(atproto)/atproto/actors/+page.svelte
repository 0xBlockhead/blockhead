<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
</script>


<Page>
	<AtprotoActorsView
		href={resolve('/atproto/actors')}
		entityFieldReference={{
			entityType: EntityType.AtprotoNetwork,
			entityId: { scope: 'AtprotoNetwork' },
			fieldName: '$$atprotoActors',
		}}
		id="atproto-actors"
	/>
</Page>
