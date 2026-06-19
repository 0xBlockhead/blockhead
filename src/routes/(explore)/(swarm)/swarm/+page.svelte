<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<Page>
	<SwarmProtocolView
		selection={select(EntityType.SwarmProtocol, {
			scope: 'SwarmProtocol',
		})}
	/>
</Page>
