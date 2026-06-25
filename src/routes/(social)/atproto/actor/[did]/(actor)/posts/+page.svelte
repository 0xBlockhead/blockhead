	<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
		// State
		let {
			params,
		} = $props()

		const selector = $derived(
			decodeURIComponent(params.did).startsWith('did:') ?
				{ did: decodeURIComponent(params.did) }
			:
				{ handle: decodeURIComponent(params.did) },
		)


		// Components
		import Page from '$/components/Page.svelte'
		import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	</script>


<Page>
		<AtprotoActorView
			selection={select(EntityType.AtprotoActor, selector)}
		/>
	</Page>
