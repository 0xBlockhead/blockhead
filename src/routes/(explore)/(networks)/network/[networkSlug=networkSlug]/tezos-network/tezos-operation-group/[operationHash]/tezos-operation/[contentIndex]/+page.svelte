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
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<Page>
	<TezosOperationView
		selection={select(EntityType.TezosOperation, data.selector)}
	/>
</Page>
