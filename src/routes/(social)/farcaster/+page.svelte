<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
</script>


<Page>
	<FarcasterView
		selection={select(EntityType.FarcasterNetwork, {
			scope: 'FarcasterNetwork',
		})}
	/>

</Page>
