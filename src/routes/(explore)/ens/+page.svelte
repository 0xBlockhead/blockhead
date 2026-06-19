<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import EnsProtocolView from '$/views/EnsProtocolView.svelte'
</script>


<Page>
	<EnsProtocolView
		selection={select(EntityType.EnsProtocol, {
			scope: 'EnsProtocol',
		})}
	/>
</Page>
