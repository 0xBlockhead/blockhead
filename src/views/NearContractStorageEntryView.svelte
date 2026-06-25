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
		'$contract',
		{
			label: 'key',
		},
		'blockHeight',
	],
	content: {
		dl: [
			[
				'$contract',
				{
					label: 'key',
				},
				'blockHeight',
				'source',
				'blockHash',
			],
			[
				{
					label: 'value availability/hash',
				},
				{
					label: 'prefix',
				},
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent NEAR contract',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'NEAR block when coordinates resolve',
					},
				],
			},
			{
				label: 'Raw state',
				items: [
					{
						label: 'base64 key/value',
					},
					{
						label: 'decoded previews',
					},
				],
			},
			{
				label: 'Change history',
				items: [
					{
						label: 'storage entries for the same key across blocks when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'view_state/data_changes payload',
					},
					{
						label: 'pagination context',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearContractStorageEntry>
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
	entityType={EntityType.NearContractStorageEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
