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
		'$network',
		'scriptHash',
		'codeHash',
	],
	content: {
		dl: [
			[
				'$network',
				'scriptHash',
				'codeHash',
				{
					label: 'parameter/storage type availability',
				},
				'tzip16MetadataUri',
				'$$contracts',
				'$$entrypoints',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contracts',
				items: [
					{
						label: 'contracts using the script',
					},
				],
			},
			{
				label: 'Entrypoints',
				items: [
					{
						label: 'entrypoint rows',
					},
				],
			},
			{
				label: 'Code',
				items: [
					{
						label: 'Micheline/Michelson code',
					},
				],
			},
			{
				label: 'Types',
				items: [
					'parameterType',
					{
						label: 'storage type trees',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'TZIP-16 metadata source evidence',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'contracts',
			label: 'contracts',
			field: '$$contracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'entrypoints',
			label: 'entrypoints',
			field: '$$entrypoints',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TezosMichelsonScript>
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
	entityType={EntityType.TezosMichelsonScript}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
