<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import ServicesView from '$/views/ServicesView.svelte'
</script>


<Page>
	<GlobalView
		selector={{ scope: 'Services' }}
		title={'Services'}
		href={resolve('/services')}
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
