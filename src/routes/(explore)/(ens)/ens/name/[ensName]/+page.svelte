<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


<Page>
	<EnsView
		selection={select(EntityType.EnsName, { name: params.ensName })}
	/>
</Page>
