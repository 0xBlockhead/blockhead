<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoView from '$/views/AtprotoView.svelte'
</script>


<Page>
	<AtprotoView
		selector={{
			scope: 'AtprotoNetwork',
		}}
	/>
</Page>
