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
				label: 'object id',
			},
			'version',
			'digest',
		],
		content: {
			dl: [
				[
					{
						label: 'object id',
					},
					'version',
					'digest',
					{
						label: 'owner',
					},
					{
						label: 'type',
					},
					{
						label: 'previous transaction',
					},
					{
						label: 'storage rebate',
					},
					'contents',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Object',
					items: [
						{
							label: 'parent Sui object',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'Sui account or parent Sui object when owner selector resolves',
						},
					],
				},
				{
					label: 'Previous transaction',
					items: [
						{
							label: 'Sui transaction when resolved',
						},
					],
				},
				{
					label: 'Dynamic fields',
					items: [
						{
							label: 'dynamic-field edges for this object/version when sourceable',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'object data/options from JSON-RPC or GraphQL',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiObjectVersion>
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
	entityType={EntityType.SuiObjectVersion}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
