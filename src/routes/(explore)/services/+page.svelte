<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import ServicesView from '$/views/ServicesView.svelte'
</script>


<Page>
	<GlobalView
		selection={select(EntityType._Global, { scope: 'Services' })}
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
