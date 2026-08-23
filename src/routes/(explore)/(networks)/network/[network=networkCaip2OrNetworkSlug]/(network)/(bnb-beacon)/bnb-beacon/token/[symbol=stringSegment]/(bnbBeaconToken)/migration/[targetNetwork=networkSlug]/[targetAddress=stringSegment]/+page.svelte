<!-- Generated from APP.ts. -->

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
	import BnbBeaconTokenMigrationView from '$/views/BnbBeaconTokenMigrationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbBeaconTokenMigration, data.selector, {
				fields: {
					migrationKind: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'bnb beacon token migration' : pageSelection.entity.migrationKind || 'bnb beacon token migration')} • bnb beacon token migration • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bnb beacon token migration'} • bnb beacon token migration • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbBeaconTokenMigration, data.selector, {
				fields: {
					migrationKind: true,
				},
			})}

	<BnbBeaconTokenMigrationView
		selection={pageSelection}
	/>
	{/if}
</Page>
