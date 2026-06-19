<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import LensView from '$/views/LensView.svelte'
</script>


<Page>
	<LensView
		selection={select(EntityType.LensNetwork, {
			scope: 'LensNetwork',
		})}
	/>
</Page>
