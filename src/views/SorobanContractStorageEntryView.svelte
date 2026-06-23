<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'contract',
			},
			{
				label: 'key hash/key',
			},
			{
				label: 'latest storage observation',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract',
					},
					{
						label: 'key hash/key',
					},
					{
						label: 'latest value/durability/TTL observation',
					},
					{
						label: 'snapshot count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Snapshots',
					items: [
						{
							label: 'ledger/source storage-entry observations',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'parent Soroban contract',
						},
					],
				},
				{
					label: 'Raw key',
					items: [
						{
							label: 'decoded key JSON',
						},
						{
							label: 'key XDR/source evidence',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContractStorageEntry>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.SorobanContractStorageEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
