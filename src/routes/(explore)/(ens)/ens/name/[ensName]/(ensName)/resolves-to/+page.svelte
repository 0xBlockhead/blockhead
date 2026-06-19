<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsResolvesToView from '$/views/EnsResolvesToView.svelte'
</script>


<Page>
	<EnsResolvesToView
		selection={select(EntityType.EnsName, { name: params.ensName })}
	/>
</Page>
