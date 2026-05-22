<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<AtprotoActorsView
		entityFieldReference={{
			entityType: EntityType.AtprotoNetwork,
			entityId: { scope: 'AtprotoNetwork' },
			fieldName: '$$atprotoActors',
		}}
		href={resolve('/atproto/actors')}
		id="atproto-actors"
	/>
</Page>
