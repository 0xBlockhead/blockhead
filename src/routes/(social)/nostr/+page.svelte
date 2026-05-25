<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import NostrView from '$/views/NostrView.svelte'
</script>


<Page>
	<NostrView
		entityId={{
			scope: 'NostrNetwork',
		}}
	/>
</Page>
