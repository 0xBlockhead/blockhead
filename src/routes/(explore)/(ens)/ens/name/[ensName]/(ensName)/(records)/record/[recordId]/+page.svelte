<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsTextRecordView from '$/views/EnsTextRecordView.svelte'
</script>


<Page>
	<EnsTextRecordView
		selection={select(EntityType.EnsName, { name: params.ensName })}
		recordId={params.recordId}
	/>
</Page>
