<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<Page>
	<EnsNameTextRecordsView
		selection={select(EntityType.EnsName, { name: params.ensName })}
	/>
</Page>
