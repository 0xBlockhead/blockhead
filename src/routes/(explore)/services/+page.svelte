<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import ServicesView from '$/views/ServicesView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{ scope: 'Services' }}
		title={'Services'}
		href="/services"
	>
		{#snippet children({
			open: hubOpen,
		} = {})}
			<ServicesView
				{hubOpen}
			/>
		{/snippet}
	</GlobalView>
</Page>
