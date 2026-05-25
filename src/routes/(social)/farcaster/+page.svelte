<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
</script>


<Page>
	<FarcasterView
		entityId={{
			scope: 'FarcasterNetwork',
		}}
	/>

</Page>
