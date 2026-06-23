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
	import HederaAllowanceView from '$/views/HederaAllowanceView.svelte'
</script>


<Page>
	<HederaAllowanceView
		selection={select(EntityType.HederaAllowance, data.selector)}
	/>
</Page>
