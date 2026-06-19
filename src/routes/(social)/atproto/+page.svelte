<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoView from '$/views/AtprotoView.svelte'
</script>


<Page>
	<AtprotoView
		selection={select(EntityType.AtprotoNetwork, {
			scope: 'AtprotoNetwork',
		})}
		open={false}
	/>
</Page>
