<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoView from '$/views/AtprotoView.svelte'
</script>


<Page>
	<AtprotoView
		entityId={{
			scope: 'AtprotoNetwork',
		}}
		href={resolve('/atproto')}
	/>
</Page>
