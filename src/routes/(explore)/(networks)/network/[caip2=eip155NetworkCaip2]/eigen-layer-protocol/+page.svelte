<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerProtocolView from '$/views/EigenLayerProtocolView.svelte'
</script>


<Page>
	<EigenLayerProtocolView
		selection={select(EntityType.EigenLayerProtocol, data.selector)}
	/>
</Page>
