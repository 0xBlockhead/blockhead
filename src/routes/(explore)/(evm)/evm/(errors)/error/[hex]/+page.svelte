<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<Page>
	<EvmErrorView
		selection={select(EntityType.EvmError, data.selector)}
	/>
</Page>
