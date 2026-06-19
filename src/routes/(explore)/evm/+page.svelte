<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<Page>
	<EvmProtocolView
		selection={select(EntityType.EvmProtocol, {
			scope: 'EvmProtocol',
		})}
	/>
</Page>
