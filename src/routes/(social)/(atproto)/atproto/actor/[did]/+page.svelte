<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


	<Page>
		<AtprotoActorView
			selector={
				decodeURIComponent(params.did).startsWith('did:') ?
					{ did: decodeURIComponent(params.did) }
				:
					{ handle: decodeURIComponent(params.did) }
			}
		/>
	</Page>
