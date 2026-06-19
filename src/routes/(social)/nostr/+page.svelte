<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import NostrView from '$/views/NostrView.svelte'
</script>


<Page>
	<NostrView
		selection={select(EntityType.NostrNetwork, {
			scope: 'NostrNetwork',
		})}
	/>
</Page>
