<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.AtprotoNetwork,
			{ scope: 'AtprotoNetwork' }
		).$$atprotoActors}
		id="atproto-actors"
	/>
</Page>
