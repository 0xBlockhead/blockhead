<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<Page>
	<GlobalEnsNetworkView
		selection={select(EntityType._GlobalEnsNetwork, {
			scope: '_GlobalEnsNetwork',
		})}
	/>
</Page>
