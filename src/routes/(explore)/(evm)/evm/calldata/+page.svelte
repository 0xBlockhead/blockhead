<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		selection={select(EntityType.EvmCalldata, { hex: '0x00000000' })}
	/>
</Page>
